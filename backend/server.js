const express = require("express");
const cors = require("cors");
const pool = require("./db"); // conexão Postgres
const bcrypt = require("bcrypt");
const multer = require("multer");
const sharp = require("sharp"); // Para compressão de imagens
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();

// Configuração do Supabase
console.log("Inicializando Supabase com URL:", process.env.SUPABASE_URL);
console.log("Chave do Supabase (primeiros 10 caracteres):", process.env.SUPABASE_KEY.substring(0, 10) + "...");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Configuração do multer (buffer em memória, não salva em disco)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middlewares
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use(cors({
  origin: ["http://localhost:8081", "https://duzeapp-production.up.railway.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
}));

/* =========================
   USUÁRIOS
========================= */
app.get("/criar-tabela-usuarios", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        imagemperfil TEXT
      );
    `);
    res.json({ success: true, message: "Tabela usuarios criada/verificada" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cadastro de usuário (com upload da foto para Supabase)
app.post("/usuarios", upload.single("imagemperfil"), async (req, res) => {
  console.log("req.file:", req.file);
  console.log("req.body:", req.body);

  const { nome, email, senha } = req.body;
  try {
    let imagemURL = null;

    if (req.file) {
      // Verifica se o arquivo é válido
      if (!req.file.buffer || req.file.buffer.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: "Arquivo de imagem inválido ou vazio" 
        });
      }

      // Gera um nome único para o arquivo
      const timestamp = Date.now();
      const filename = `perfil-${timestamp}.jpg`;
      console.log("Tentando fazer upload do arquivo:", filename);
      console.log("Tipo MIME:", req.file.mimetype);
      console.log("Tamanho do buffer:", req.file.buffer.length);

      try {
        // Verifica se o bucket existe, se não, cria
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        
        if (bucketsError) {
          console.error("Erro ao listar buckets:", bucketsError);
          return res.status(500).json({ 
            success: false, 
            error: "Erro ao verificar buckets no Supabase" 
          });
        }
        
        const bucketExists = buckets && buckets.some(bucket => bucket.name === 'usuarios');
        
        if (!bucketExists) {
          console.log("Criando bucket 'usuarios'");
          const { error: createBucketError } = await supabase.storage.createBucket('usuarios', {
            public: true
          });
          
          if (createBucketError) {
            console.error("Erro ao criar bucket:", createBucketError);
            return res.status(500).json({ 
              success: false, 
              error: "Erro ao criar bucket no Supabase" 
            });
          }
        }

        // Verifica o tamanho do arquivo antes do upload
        const fileSizeInMB = req.file.buffer.length / (1024 * 1024);
        console.log(`Tamanho original do arquivo: ${fileSizeInMB.toFixed(2)} MB`);
        
        // Comprime a imagem usando Sharp
        let compressedBuffer;
        try {
          compressedBuffer = await sharp(req.file.buffer)
            .resize(800, 800, { 
              fit: 'inside', 
              withoutEnlargement: true 
            })
            .jpeg({ 
              quality: 80,
              progressive: true 
            })
            .toBuffer();
          
          const compressedSizeInMB = compressedBuffer.length / (1024 * 1024);
          console.log(`Tamanho após compressão: ${compressedSizeInMB.toFixed(2)} MB`);
          console.log(`Redução de tamanho: ${((fileSizeInMB - compressedSizeInMB) / fileSizeInMB * 100).toFixed(1)}%`);
          
        } catch (compressionError) {
          console.error("Erro na compressão da imagem:", compressionError);
          // Se falhar na compressão, usa o buffer original
          compressedBuffer = req.file.buffer;
        }
        
        // Verifica se ainda está muito grande após compressão
        const finalSizeInMB = compressedBuffer.length / (1024 * 1024);
        if (finalSizeInMB > 5) {
          return res.status(400).json({ 
            success: false, 
            error: "Arquivo muito grande mesmo após compressão. Tente uma imagem menor." 
          });
        }

        // Usa o buffer comprimido para upload
        const fileData = compressedBuffer;
        
        // Faz o upload do arquivo diretamente com o buffer comprimido
        const { data, error } = await supabase.storage
          .from("usuarios")
          .upload(filename, fileData, {
            contentType: 'image/jpeg', // Sempre JPEG após compressão
            cacheControl: '3600',
            upsert: true
          });

        if (error) {
          console.error("Erro ao enviar para Supabase:", error);
          return res.status(500).json({ 
            success: false, 
            error: "Erro ao fazer upload da imagem para o Supabase" 
          });
        } else {
          console.log("Upload bem-sucedido:", data);

          // Gera URL pública - Construção direta da URL
          const publicURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/usuarios/${filename}`;
          imagemURL = publicURL;
          console.log("Imagem salva no Supabase:", imagemURL);
          
          // Verifica se a URL foi gerada corretamente
          if (!imagemURL) {
            console.error("Falha ao gerar URL pública da imagem");
            return res.status(500).json({ 
              success: false, 
              error: "Falha ao gerar URL pública da imagem" 
            });
          } else {
            console.log("URL pública gerada com sucesso:", imagemURL);
          }
        }
      } catch (uploadError) {
        console.error("Erro durante processo de upload:", uploadError);
        return res.status(500).json({ 
          success: false, 
          error: "Erro durante o processo de upload da imagem" 
        });
      }
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    console.log("Dados que serão inseridos no banco:");
    console.log("- Nome:", nome);
    console.log("- Email:", email);
    console.log("- URL da imagem:", imagemURL);

    const result = await pool.query(
      "INSERT INTO usuarios (nome,email,senha,imagemperfil) VALUES ($1,$2,$3,$4) RETURNING id,nome,email,imagemperfil",
      [nome, email, senhaHash, imagemURL]
    );

    console.log("Usuário inserido no banco:", result.rows[0]);
    console.log("URL da imagem salva no banco:", result.rows[0].imagemperfil);

    res.status(201).json({ success: true, usuario: result.rows[0] });
  } catch (err) {
    console.error("Erro no cadastro:", err.message);
    
    // Verifica se é um erro de email duplicado
    if (err.message.includes("usuarios_email_key")) {
      return res.status(400).json({ 
        success: false, 
        error: "Este email já está cadastrado. Por favor, use outro email ou faça login." 
      });
    }
    
    res.status(500).json({ success: false, error: err.message });
  }
});
;

// Login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email=$1", [email]);
    if (!result.rowCount)
      return res.status(400).json({ success: false, error: "Usuário não encontrado" });

    const usuario = result.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta)
      return res.status(401).json({ success: false, error: "Senha incorreta" });

    delete usuario.senha;
    res.json({ success: true, usuario });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================
   PRODUTOS
========================= */
app.get("/produtos", async (req, res) => {
  try {
    const result = await pool.query("SELECT id,nome,preco,estoque,imagem,descricao FROM produtos ORDER BY id");
    res.json({ success: true, produtos: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/produto", async (req, res) => {
  const { nome, preco, estoque, descricao, imagem } = req.body;
  try {
    const result = await pool.query("INSERT INTO produtos (nome,preco,estoque,descricao,imagem) VALUES ($1,$2,$3,$4,$5) RETURNING id", [nome, preco, estoque, descricao, imagem]);
    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/produto/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, preco, estoque, descricao, imagem } = req.body;
  try {
    const result = await pool.query("UPDATE produtos SET nome=$1,preco=$2,estoque=$3,descricao=$4,imagem=$5 WHERE id=$6 RETURNING *", [nome, preco, estoque, descricao, imagem, id]);
    if (!result.rowCount) return res.status(404).json({ success: false, error: "Produto não encontrado" });
    res.json({ success: true, produto: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/produto/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM produtos WHERE id=$1 RETURNING id", [id]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: "Produto não encontrado" });
    res.json({ success: true, message: `Produto ${id} deletado` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================
   INICIAR SERVIDOR
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`))