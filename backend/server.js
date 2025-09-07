require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do pool PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME.replace(/\s/g, "_"), // remove espaços se houver
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT, 10),
});

// Rota para criar tabelas (rodar apenas uma vez)
app.get("/criar-tabelas", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        usuario_id INT REFERENCES usuarios(id),
        produto VARCHAR(100),
        quantidade INT,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    res.send("Tabelas 'usuarios' e 'pedidos' criadas com sucesso!");
  } catch (err) {
    console.error("Erro ao criar tabelas:", err.message);
    res.status(500).send("Erro ao criar tabelas");
  }
});

// Rota para listar todos os usuários
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err.message);
    res.status(500).send("Erro ao buscar usuários");
  }
});

// Criar um usuário
app.post("/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
      [nome, email, senha]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar usuário:", err.message);
    res.status(500).send("Erro ao criar usuário");
  }
});

// Popular usuários de teste
app.post("/usuarios/popular", async (req, res) => {
  try {
    const usuarios = [
      { nome: "João Silva", email: "joao.silva@email.com", senha: "123456" },
      { nome: "Maria Oliveira", email: "maria.oliveira@email.com", senha: "abcdef" },
      { nome: "Carlos Souza", email: "carlos.souza@email.com", senha: "senha123" },
      { nome: "Ana Lima", email: "ana.lima@email.com", senha: "minhasenha" },
      { nome: "Pedro Santos", email: "pedro.santos@email.com", senha: "teste2025" }
    ];

    const promises = usuarios.map(u =>
      pool.query(
        "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING *",
        [u.nome, u.email, u.senha]
      )
    );

    const results = await Promise.all(promises);
    const usuariosInseridos = results.map(r => r.rows[0]).filter(r => r !== undefined);

    res.json({
      message: "Usuários padrão inseridos",
      usuariosInseridos
    });

  } catch (err) {
    console.error("Erro ao popular usuários:", err.message);
    res.status(500).send("Erro ao popular usuários");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`API rodando em http://localhost:${process.env.PORT || 3000}`);
});
