// const express = require("express");
// const cors = require("cors");
// const pool = require("./db"); // conexão Postgres
// const bcrypt = require("bcrypt");
// const multer = require("multer");
// const { createClient } = require("@supabase/supabase-js");
// require("dotenv").config();

// const app = express();

// // Configuração do Supabase
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// // Configuração do multer (buffer em memória, não salva em disco)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Middlewares
// app.use(express.json({ limit: "20mb" }));
// app.use(express.urlencoded({ limit: "20mb", extended: true }));

// app.use(cors({
//   origin: ["http://localhost:8081", "https://duzeapp-production.up.railway.app"],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "Accept"],
//   credentials: true,
// }));

// /* =========================
//    USUÁRIOS
// ========================= */
// app.get("/criar-tabela-usuarios", async (req, res) => {
//   try {
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS usuarios (
//         id SERIAL PRIMARY KEY,
//         nome TEXT NOT NULL,
//         email TEXT UNIQUE NOT NULL,
//         senha TEXT NOT NULL,
//         imagemperfil TEXT
//       );
//     `);
//     res.json({ success: true, message: "Tabela usuarios criada/verificada" });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // Cadastro de usuário (com upload da foto para Supabase)
// app.post("/usuarios", upload.single("imagemperfil"), async (req, res) => {
//   console.log("req.file:", req.file);
//   console.log("req.body:", req.body);

//   const { nome, email, senha } = req.body;
//   try {
//     let imagemURL = null;

//     if (req.file) {
//       const filename = `perfil-${Date.now()}.jpg`;

//       const { error } = await supabase.storage
//         .from("usuarios")
//         .upload(filename, req.file.buffer, {
//           contentType: req.file.mimetype,
//           upsert: true,
//         });

//       if (error) {
//         console.error("Erro ao enviar para Supabase:", error);
//         return res.status(500).json({ success: false, error: error.message });
//       }

//       // Gera URL pública
//       const { data: publicData } = supabase.storage
//         .from("usuarios")
//         .getPublicUrl(filename);

//       imagemURL = publicData.publicUrl;
//       console.log("Imagem salva no Supabase:", imagemURL);
//     }

//     const senhaHash = await bcrypt.hash(senha, 10);

//     const result = await pool.query(
//       "INSERT INTO usuarios (nome,email,senha,imagemperfil) VALUES ($1,$2,$3,$4) RETURNING id,nome,email,imagemperfil",
//       [nome, email, senhaHash, imagemURL]
//     );

//     res.status(201).json({ success: true, usuario: result.rows[0] });
//   } catch (err) {
//     console.error("Erro no cadastro:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });
// ;

// // Login
// app.post("/login", async (req, res) => {
//   const { email, senha } = req.body;
//   try {
//     const result = await pool.query("SELECT * FROM usuarios WHERE email=$1", [email]);
//     if (!result.rowCount)
//       return res.status(400).json({ success: false, error: "Usuário não encontrado" });

//     const usuario = result.rows[0];
//     const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
//     if (!senhaCorreta)
//       return res.status(401).json({ success: false, error: "Senha incorreta" });

//     delete usuario.senha;
//     res.json({ success: true, usuario });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// /* =========================
//    PRODUTOS
// ========================= */
// app.get("/produtos", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT id,nome,preco,estoque,imagem,descricao FROM produtos ORDER BY id");
//     res.json({ success: true, produtos: result.rows });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// app.post("/produto", async (req, res) => {
//   const { nome, preco, estoque, descricao, imagem } = req.body;
//   try {
//     const result = await pool.query("INSERT INTO produtos (nome,preco,estoque,descricao,imagem) VALUES ($1,$2,$3,$4,$5) RETURNING id", [nome, preco, estoque, descricao, imagem]);
//     res.status(201).json({ success: true, id: result.rows[0].id });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// app.put("/produto/:id", async (req, res) => {
//   const { id } = req.params;
//   const { nome, preco, estoque, descricao, imagem } = req.body;
//   try {
//     const result = await pool.query("UPDATE produtos SET nome=$1,preco=$2,estoque=$3,descricao=$4,imagem=$5 WHERE id=$6 RETURNING *", [nome, preco, estoque, descricao, imagem, id]);
//     if (!result.rowCount) return res.status(404).json({ success: false, error: "Produto não encontrado" });
//     res.json({ success: true, produto: result.rows[0] });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// app.delete("/produto/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query("DELETE FROM produtos WHERE id=$1 RETURNING id", [id]);
//     if (!result.rowCount) return res.status(404).json({ success: false, message: "Produto não encontrado" });
//     res.json({ success: true, message: `Produto ${id} deletado` });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// /* =========================
//    INICIAR SERVIDOR
// ========================= */
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`))






const express = require("express");
const cors = require("cors");
const pool = require("./db"); // conexão Postgres
const bcrypt = require("bcrypt");
const multer = require("multer");
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
          // Continua mesmo com erro, tentando criar o bucket
        }
        
        const bucketExists = buckets && buckets.some(bucket => bucket.name === 'usuarios');
        
        if (!bucketExists) {
          console.log("Criando bucket 'usuarios'");
          const { error: createBucketError } = await supabase.storage.createBucket('usuarios', {
            public: true
          });
          
          if (createBucketError) {
            console.error("Erro ao criar bucket:", createBucketError);
            // Continua mesmo com erro, tentando fazer upload
          }
        }

        // Faz o upload do arquivo
        const { data, error } = await supabase.storage
          .from("usuarios")
          .upload(filename, req.file.buffer, {
            contentType: req.file.mimetype || 'image/jpeg',
            cacheControl: '3600',
            upsert: true
          });

        if (error) {
          console.error("Erro ao enviar para Supabase:", error);
          // Continua mesmo com erro, para salvar o usuário sem imagem
        } else {
          console.log("Upload bem-sucedido:", data);

          // Gera URL pública
          const { data: publicData } = supabase.storage
            .from("usuarios")
            .getPublicUrl(filename);

          if (publicData && publicData.publicUrl) {
            imagemURL = publicData.publicUrl;
            console.log("Imagem salva no Supabase:", imagemURL);
          } else {
            console.error("Falha ao obter URL pública");
          }
        }
      } catch (uploadError) {
        console.error("Erro durante processo de upload:", uploadError);
        // Continua mesmo com erro, para salvar o usuário sem imagem
      }
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      "INSERT INTO usuarios (nome,email,senha,imagemperfil) VALUES ($1,$2,$3,$4) RETURNING id,nome,email,imagemperfil",
      [nome, email, senhaHash, imagemURL]
    );

    res.status(201).json({ success: true, usuario: result.rows[0] });
  } catch (err) {
    console.error("Erro no cadastro:", err.message);
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