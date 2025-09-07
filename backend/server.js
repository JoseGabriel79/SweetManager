require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});


// rota de teste
app.get("/usuarios", async (req, res) => {
  const result = await pool.query("SELECT * FROM usuarios");
  res.json(result.rows);
});


// criar usuário
app.post("/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;
  const result = await pool.query(
    "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
    [nome, email, senha]
  );
  res.json(result.rows[0]);
});

app.listen(3000, () => {
  console.log("API rodando em http://localhost:3000");
});
