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


app.get("/criar-tabelas", async (req, res) => {
  try {
    // Cria a tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL
      );
    `);

    // Cria a tabela de pedidos
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



// Rota para popular o banco com usuários de teste
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
    console.error(err);
    res.status(500).send("Erro ao popular usuários");
  }
});
