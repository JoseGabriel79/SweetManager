const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3000,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: {
    rejectUnauthorized: false, // Railway exige SSL em alguns casos
  },
});

module.exports = pool;
