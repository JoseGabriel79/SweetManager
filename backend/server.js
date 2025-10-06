/**
 * Visão geral do backend
 *
 * Este servidor Express expõe uma API REST para autenticação básica de usuário
 * e CRUD de produtos, integrando com PostgreSQL (via Pool) e Supabase Storage
 * para upload/remoção de imagens.
 *
 * Fluxo pr
 * incipal:
 * - Inicialização: ensureTables() cria/atualiza tabelas 'usuarios' e 'produtos' de forma idempotente
 * - Produtos: endpoints GET/POST/PUT/DELETE são todos escopados por 'usuario_id'
 * - Imagens: uploads vão para o bucket 'produtos'; remoções acontecem ao excluir produto ou conta
 * - Conta: DELETE /usuarios/:id remove usuário, produtos e respectivas imagens nos buckets
 *
 * Convenções:
 * - 'imagem' nos produtos armazena URL pública; ao deletar, tentamos remover arquivo no Supabase quando for URL do próprio Supabase
 * - As operações de remoção de imagens não bloqueiam a deleção de registros em caso de falha (podemos tornar mais estrito se necessário)
 */
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

const corsOptions = {
  origin: [
    "http://localhost:8081",
    "http://localhost:8082",
    "http://localhost:8083",
    "https://sweetmanager.up.railway.app/",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  optionsSuccessStatus: 204, // garante resposta OK ao preflight
};

app.use(cors(corsOptions));
// Trata preflight explicitamente para todas as rotas (Express 5)
app.options(/.*/, cors(corsOptions));

// Inicializa tabelas no banco ao subir o servidor
async function ensureTables() {
  try {
    // Tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        imagemperfil TEXT
      );
    `);

    // Tabela de produtos com vínculo ao usuário
    await pool.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        estoque INTEGER NOT NULL,
        descricao TEXT,
        imagem TEXT,
        usuario_id INTEGER REFERENCES usuarios(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Correções/migrações idempotentes
    await pool.query(`
      ALTER TABLE produtos ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuarios(id);
    `);
    await pool.query(`
      ALTER TABLE produtos ALTER COLUMN imagem TYPE TEXT USING imagem::text;
    `);

    console.log("✅ Tabelas 'usuarios' e 'produtos' verificadas/atualizadas.");
  } catch (err) {
    console.error("❌ Erro ao inicializar tabelas:", err);
  }
}

// dispara criação/verificação das tabelas
ensureTables();

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
  console.log("=== INÍCIO DO PROCESSO DE CADASTRO ===");
  console.log("req.file:", req.file);
  console.log("req.body:", req.body);
  console.log("Arquivo recebido:", req.file ? "SIM" : "NÃO");

  const { nome, email, senha } = req.body;
  try {
    let imagemURL = null;
    console.log("Inicializando imagemURL como:", imagemURL);

    if (req.file) {
      console.log("=== PROCESSANDO UPLOAD DE IMAGEM ===");
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
          console.log("=== GERANDO URL PÚBLICA ===");

          // Gera URL pública - Construção direta da URL
          const publicURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/usuarios/${filename}`;
          imagemURL = publicURL;
          console.log("URL construída:", publicURL);
          console.log("imagemURL definida como:", imagemURL);
          console.log("Imagem salva no Supabase:", imagemURL);
          
          // Verifica se a URL foi gerada corretamente
          if (!imagemURL) {
            console.error("ERRO: Falha ao gerar URL pública da imagem");
            return res.status(500).json({ 
              success: false, 
              error: "Falha ao gerar URL pública da imagem" 
            });
          } else {
            console.log("✅ URL pública gerada com sucesso:", imagemURL);
          }
        }
      } catch (uploadError) {
        console.error("Erro durante processo de upload:", uploadError);
        return res.status(500).json({ 
          success: false, 
          error: "Erro durante o processo de upload da imagem" 
        });
      }
    } else {
      console.log("=== NENHUMA IMAGEM ENVIADA ===");
      console.log("imagemURL permanece como:", imagemURL);
    }

    console.log("=== PREPARANDO DADOS PARA O BANCO ===");
    const senhaHash = await bcrypt.hash(senha, 10);

    console.log("Dados que serão inseridos no banco:");
    console.log("- Nome:", nome);
    console.log("- Email:", email);
    console.log("- URL da imagem ANTES da inserção:", imagemURL);
    console.log("- imagemURL é null?", imagemURL === null);
    console.log("- imagemURL é undefined?", imagemURL === undefined);
    console.log("- Tipo de imagemURL:", typeof imagemURL);

    const result = await pool.query(
      "INSERT INTO usuarios (nome,email,senha,imagemperfil) VALUES ($1,$2,$3,$4) RETURNING id,nome,email,imagemperfil",
      [nome, email, senhaHash, imagemURL]
    );

    console.log("=== RESULTADO DA INSERÇÃO NO BANCO ===");
    console.log("Usuário inserido no banco:", result.rows[0]);
    console.log("URL da imagem salva no banco:", result.rows[0].imagemperfil);
    console.log("imagemperfil é null no banco?", result.rows[0].imagemperfil === null);
    console.log("imagemperfil é undefined no banco?", result.rows[0].imagemperfil === undefined);
    console.log("Tipo de imagemperfil no banco:", typeof result.rows[0].imagemperfil);
    console.log("=== FIM DO PROCESSO DE CADASTRO ===");

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

// Atualizar foto de perfil do usuário
app.put("/usuarios/:id/imagem", upload.single("imagemperfil"), async (req, res) => {
  const { id } = req.params;
  try {
    // Busca usuário atual para obter a imagem antiga
    const current = await pool.query("SELECT id, nome, email, imagemperfil FROM usuarios WHERE id=$1", [id]);
    if (!current.rowCount) {
      return res.status(404).json({ success: false, error: "Usuário não encontrado" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: "Nenhuma imagem enviada" });
    }

    // Verifica e comprime imagem
    let finalBuffer;
    try {
      const compressed = await sharp(req.file.buffer)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();
      finalBuffer = compressed;
    } catch (err) {
      finalBuffer = req.file.buffer;
    }

    // Gera nome único e faz upload
    const timestamp = Date.now();
    const filename = `perfil-${id}-${timestamp}.jpg`;
    const { data, error } = await supabase.storage
      .from("usuarios")
      .upload(filename, finalBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      return res.status(500).json({ success: false, error: "Erro ao fazer upload da imagem para o Supabase" });
    }

    const publicURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/usuarios/${filename}`;

    // Atualiza link no Postgres
    const updated = await pool.query(
      "UPDATE usuarios SET imagemperfil=$1 WHERE id=$2 RETURNING id, nome, email, imagemperfil",
      [publicURL, id]
    );

    // Remove imagem anterior do Supabase (se existir)
    const oldUrl = current.rows[0].imagemperfil;
    if (oldUrl && typeof oldUrl === 'string') {
      const parts = oldUrl.split('/usuarios/');
      if (parts.length === 2) {
        const oldKey = parts[1];
        const { data: removeData, error: removeError } = await supabase.storage.from('usuarios').remove([oldKey]);
        if (removeError) {
          console.error('Erro ao remover imagem antiga do Supabase:', removeError);
        }
      }
    }

    res.json({ success: true, usuario: updated.rows[0] });
  } catch (err) {
    console.error("Erro ao atualizar imagem:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Remover foto de perfil do usuário (apaga do Supabase e limpa link no Postgres)
app.delete("/usuarios/:id/imagem", async (req, res) => {
  const { id } = req.params;
  try {
    const current = await pool.query("SELECT id, nome, email, imagemperfil FROM usuarios WHERE id=$1", [id]);
    if (!current.rowCount) {
      return res.status(404).json({ success: false, error: "Usuário não encontrado" });
    }

    const oldUrl = current.rows[0].imagemperfil;
    if (oldUrl && typeof oldUrl === 'string') {
      const parts = oldUrl.split('/usuarios/');
      if (parts.length === 2) {
        const oldKey = parts[1];
        const { data: removeData, error: removeError } = await supabase.storage.from('usuarios').remove([oldKey]);
        if (removeError) {
          console.error('Erro ao remover imagem do Supabase:', removeError);
        }
      }
    }

    // Limpa o link no Postgres para que o app use a foto padrão local
    const updated = await pool.query(
      "UPDATE usuarios SET imagemperfil=NULL WHERE id=$1 RETURNING id, nome, email, imagemperfil",
      [id]
    );

    res.json({ success: true, usuario: updated.rows[0] });
  } catch (err) {
    console.error("Erro ao remover imagem:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

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
// Criar/alterar tabela de produtos para vincular ao usuário e suportar imagem
app.get("/criar-tabela-produtos", async (req, res) => {
  try {
    // Cria a tabela se não existir já com usuario_id
    await pool.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        estoque INTEGER NOT NULL,
        descricao TEXT,
        imagem TEXT,
        usuario_id INTEGER REFERENCES usuarios(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Garante coluna usuario_id caso a tabela exista antiga
    await pool.query(`
      ALTER TABLE produtos ADD COLUMN IF NOT EXISTS usuario_id INTEGER REFERENCES usuarios(id);
    `);

    // Ajusta tipo da coluna imagem para TEXT (links longos)
    await pool.query(`
      ALTER TABLE produtos ALTER COLUMN imagem TYPE TEXT USING imagem::text;
    `);

    res.json({ success: true, message: "Tabela produtos criada/atualizada" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/produtos", async (req, res) => {
  try {
    const usuarioId = parseInt(req.query.usuario_id, 10);
    if (!usuarioId) {
      return res.status(400).json({ success: false, error: "usuario_id obrigatório" });
    }
    const result = await pool.query(
      "SELECT id,nome,preco,estoque,imagem,descricao,usuario_id FROM produtos WHERE usuario_id=$1 ORDER BY id",
      [usuarioId]
    );
    res.json({ success: true, produtos: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cadastro de produto com upload opcional de imagem para Supabase (bucket 'produtos')
app.post("/produto", upload.single("imagemproduto"), async (req, res) => {
  const { nome, preco, estoque, descricao, usuario_id } = req.body;
  try {
    const usuarioId = parseInt(usuario_id, 10);
    if (!usuarioId) {
      return res.status(400).json({ success: false, error: "usuario_id obrigatório" });
    }

    let imagemURL = null;
    if (req.file) {
      // Verifica/Cria bucket 'produtos'
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        return res.status(500).json({ success: false, error: "Erro ao verificar buckets no Supabase" });
      }
      const bucketExists = buckets && buckets.some((b) => b.name === "produtos");
      if (!bucketExists) {
        const { error: createBucketError } = await supabase.storage.createBucket("produtos", { public: true });
        if (createBucketError) {
          return res.status(500).json({ success: false, error: "Erro ao criar bucket 'produtos' no Supabase" });
        }
      }

      // Comprime imagem
      let finalBuffer;
      try {
        finalBuffer = await sharp(req.file.buffer)
          .resize(800, 800, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 80, progressive: true })
          .toBuffer();
      } catch (e) {
        finalBuffer = req.file.buffer;
      }

      const timestamp = Date.now();
      const filename = `produto-${usuarioId}-${timestamp}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("produtos")
        .upload(filename, finalBuffer, { contentType: "image/jpeg", cacheControl: "3600", upsert: true });
      if (uploadError) {
        return res.status(500).json({ success: false, error: "Erro ao fazer upload da imagem do produto" });
      }
      imagemURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/produtos/${filename}`;
    }

    const result = await pool.query(
      "INSERT INTO produtos (nome,preco,estoque,descricao,imagem,usuario_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id",
      [nome, preco, estoque, descricao || null, imagemURL, usuarioId]
    );
    res.status(201).json({ success: true, id: result.rows[0].id, imagem: imagemURL });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/produto/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, preco, estoque, descricao, imagem } = req.body;
  try {
    const usuarioId = parseInt(req.query.usuario_id, 10);
    if (!usuarioId) {
      return res.status(400).json({ success: false, error: "usuario_id obrigatório" });
    }
    const result = await pool.query(
      "UPDATE produtos SET nome=$1,preco=$2,estoque=$3,descricao=$4,imagem=$5 WHERE id=$6 AND usuario_id=$7 RETURNING *",
      [nome, preco, estoque, descricao, imagem, id, usuarioId]
    );
    if (!result.rowCount) return res.status(404).json({ success: false, error: "Produto não encontrado" });
    res.json({ success: true, produto: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/produto/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const usuarioId = parseInt(req.query.usuario_id, 10);
    if (!usuarioId) {
      return res.status(400).json({ success: false, error: "usuario_id obrigatório" });
    }
    // Busca produto para obter URL da imagem antes de deletar
    const current = await pool.query(
      "SELECT id, imagem FROM produtos WHERE id=$1 AND usuario_id=$2",
      [id, usuarioId]
    );

    if (!current.rowCount) {
      return res.status(404).json({ success: false, message: "Produto não encontrado" });
    }

    const imagemUrl = current.rows[0].imagem;
    let imagemRemovida = false;

    // Remove imagem do Supabase se for uma URL pública do bucket 'produtos'
    if (imagemUrl && typeof imagemUrl === "string" && imagemUrl.includes("/produtos/")) {
      const parts = imagemUrl.split("/produtos/");
      if (parts.length === 2) {
        const key = parts[1];
        try {
          const { error: removeError } = await supabase.storage.from("produtos").remove([key]);
          if (!removeError) {
            imagemRemovida = true;
          } else {
            console.error("Erro ao remover imagem do Supabase:", removeError);
          }
        } catch (e) {
          console.error("Exceção ao remover imagem do Supabase:", e);
        }
      }
    }

    // Deleta o produto do banco
    const result = await pool.query(
      "DELETE FROM produtos WHERE id=$1 AND usuario_id=$2 RETURNING id",
      [id, usuarioId]
    );
    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: "Produto não encontrado" });
    }

    res.json({ success: true, message: `Produto ${id} deletado`, imagemRemovida });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Exclusão completa de conta do usuário e seus dados relacionados
app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const usuarioId = parseInt(id, 10);
  if (!usuarioId) {
    return res.status(400).json({ success: false, error: "ID de usuário inválido" });
  }
  try {
    // Verifica existência do usuário
    const userRes = await pool.query("SELECT id, imagemperfil FROM usuarios WHERE id=$1", [usuarioId]);
    if (!userRes.rowCount) {
      return res.status(404).json({ success: false, error: "Usuário não encontrado" });
    }

    // Busca todos os produtos do usuário para remover imagens no Supabase
    const prodRes = await pool.query(
      "SELECT id, imagem FROM produtos WHERE usuario_id=$1",
      [usuarioId]
    );
    const produtos = prodRes.rows || [];

    // Remove imagens de produtos no Supabase em batch
    const productKeys = produtos
      .map(p => (typeof p.imagem === 'string' && p.imagem.includes('/produtos/') ? p.imagem.split('/produtos/')[1] : null))
      .filter(Boolean);

    if (productKeys.length) {
      try {
        const { error: removeProductsErr } = await supabase.storage.from('produtos').remove(productKeys);
        if (removeProductsErr) {
          console.error('Erro ao remover imagens de produtos do Supabase:', removeProductsErr);
        }
      } catch (e) {
        console.error('Exceção ao remover imagens de produtos do Supabase:', e);
      }
    }

    // Remove imagem de perfil do usuário no Supabase, se existir
    const perfilUrl = userRes.rows[0].imagemperfil;
    if (perfilUrl && typeof perfilUrl === 'string' && perfilUrl.includes('/usuarios/')) {
      const key = perfilUrl.split('/usuarios/')[1];
      if (key) {
        try {
          const { error: removePerfilErr } = await supabase.storage.from('usuarios').remove([key]);
          if (removePerfilErr) {
            console.error('Erro ao remover imagem de perfil no Supabase:', removePerfilErr);
          }
        } catch (e) {
          console.error('Exceção ao remover imagem de perfil no Supabase:', e);
        }
      }
    }

    // Exclui registros relacionados antes de excluir o usuário
    await pool.query("DELETE FROM produtos WHERE usuario_id=$1", [usuarioId]);

    // Exclui o usuário
    const delUser = await pool.query("DELETE FROM usuarios WHERE id=$1 RETURNING id", [usuarioId]);
    if (!delUser.rowCount) {
      return res.status(404).json({ success: false, error: "Usuário não encontrado" });
    }

    res.json({ success: true, message: `Usuário ${usuarioId} e dados relacionados excluídos` });
  } catch (err) {
    console.error('Erro ao excluir conta:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================
   INICIAR SERVIDOR
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`))