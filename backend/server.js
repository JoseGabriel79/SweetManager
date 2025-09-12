// const express = require("express");
// const cors = require("cors");
// const pool = require("./db");
// require("dotenv").config();

// const app = express();

// const corsOptions = {
//   origin: ["http://localhost:8081", "https://duzeapp-production.up.railway.app"],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "Accept"],
//   credentials: true,
// };

// app.use(cors(corsOptions)); // 🔥 já cuida do OPTIONS internamente



// app.use(express.json());

// // Rota de teste
// app.get("/ping", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     res.json({ success: true, time: result.rows[0] });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // Rota produtos
// app.get("/produtos", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT id, nome, preco, estoque, imagem, descricao FROM produtos ORDER BY id"
//     );
//     res.json({ success: true, produtos: result.rows });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// app.post("/produto", async (req, res) => {
//   const { nome, preco, estoque, descricao, imagem } = req.body;
//   try {
//     const result = await pool.query(
//       "INSERT INTO produtos (nome, preco, estoque, descricao, imagem) VALUES ($1, $2, $3, $4, $5) RETURNING id",
//       [nome, preco, estoque, descricao, imagem]
//     );
//     res.status(201).json({ success: true, id: result.rows[0].id });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // Atualizar produto
// app.put("/produto/:id", async (req, res) => {
//     const { id } = req.params;
//     const { nome, preco, estoque, descricao, imagem } = req.body;

//     try {
//         const result = await pool.query(
//             "UPDATE produtos SET nome = $1, preco = $2, estoque = $3, descricao = $4, imagem = $5 WHERE id = $6 RETURNING *",
//             [nome, preco, estoque, descricao, imagem, id]
//         );

//         if (result.rowCount === 0) {
//             return res.status(404).json({ success: false, error: "Produto não encontrado" });
//         }

//         res.json({ success: true, produto: result.rows[0], message: "Produto atualizado com sucesso!" });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// });


// // 🔥 Rota produtos - deletar por ID
// app.delete("/produto/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query("DELETE FROM produtos WHERE id = $1 RETURNING id", [id]);

//     if (result.rowCount === 0) {
//       return res.status(404).json({ success: false, message: "Produto não encontrado" });
//     }

//     res.json({ success: true, message: `Produto ${id} deletado com sucesso` });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // Porta dinâmica
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Servidor rodando na porta ${PORT}`);
// });




// server.js
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();

// 🔥 Configuração CORS
const corsOptions = {
  origin: ["http://localhost:8081", "https://duzeapp-production.up.railway.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

/* =========================
   🔹 ROTAS USUÁRIOS
========================= */

// Criar tabela usuários (apenas uma vez)
app.get("/criar-tabela-usuarios", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        imagemPerfil TEXT
      );
    `);
    res.json({ success: true, message: "Tabela usuarios criada/verificada com sucesso" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cadastro de usuário
app.post("/usuario", async (req, res) => {
  const { nome, email, senha, imagemPerfil } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senha, imagemPerfil) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, imagemPerfil",
      [nome, email, senhaHash, imagemPerfil]
    );

    res.status(201).json({ success: true, usuario: result.rows[0], message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login de usuário (sem JWT, retorna apenas dados)
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (result.rowCount === 0) {
      return res.status(400).json({ success: false, error: "Usuário não encontrado" });
    }

    const usuario = result.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ success: false, error: "Senha incorreta" });
    }

    delete usuario.senha; // não expor a senha
    res.json({ success: true, usuario, message: "Login realizado com sucesso!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================
   🔹 ROTAS PRODUTOS
========================= */

// Rota de teste
app.get("/ping", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Listar produtos
app.get("/produtos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nome, preco, estoque, imagem, descricao FROM produtos ORDER BY id"
    );
    res.json({ success: true, produtos: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Criar produto
app.post("/produto", async (req, res) => {
  const { nome, preco, estoque, descricao, imagem } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO produtos (nome, preco, estoque, descricao, imagem) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [nome, preco, estoque, descricao, imagem]
    );
    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Atualizar produto
app.put("/produto/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, preco, estoque, descricao, imagem } = req.body;

  try {
    const result = await pool.query(
      "UPDATE produtos SET nome = $1, preco = $2, estoque = $3, descricao = $4, imagem = $5 WHERE id = $6 RETURNING *",
      [nome, preco, estoque, descricao, imagem, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: "Produto não encontrado" });
    }

    res.json({ success: true, produto: result.rows[0], message: "Produto atualizado com sucesso!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Deletar produto
app.delete("/produto/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM produtos WHERE id = $1 RETURNING id", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Produto não encontrado" });
    }

    res.json({ success: true, message: `Produto ${id} deletado com sucesso` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================
   🔹 INICIAR SERVIDOR
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
