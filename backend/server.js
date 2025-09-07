const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();

// Configurando CORS
// Permite apenas o frontend específico (mais seguro)
app.use(cors({ origin: "https://duzeapp-production.up.railway.app" }));

// Caso queira permitir qualquer origem (teste rápido), use:
// app.use(cors());

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
    const result = await pool.query("SELECT id, nome, preco FROM produtos ORDER BY id");
    res.json({ success: true, produtos: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Porta dinâmica
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
