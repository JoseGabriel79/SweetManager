const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: ["http://localhost:8081", "https://duzeapp-production.up.railway.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
};

app.use(cors(corsOptions)); // 🔥 já cuida do OPTIONS internamente



app.use(express.json());

// Rota de teste
app.get("/ping", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Rota produtos
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


// 🔥 Rota produtos - deletar por ID
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

// Porta dinâmica
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
