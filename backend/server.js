const express = require("express");
const pool = require("./db");
require("dotenv").config();

const app = express();

app.get("/ping", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${process.env.PORT}`);
});
