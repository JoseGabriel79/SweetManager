// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT || 3000,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   ssl: {
//     rejectUnauthorized: false, // Railway exige SSL em alguns casos
//   },
// });



// module.exports = pool;


// db.js
const { Pool } = require("pg");
require("dotenv").config();

// Configuração do pool para Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // URL do banco fornecida pelo Railway
  ssl: {
    rejectUnauthorized: false, // necessário para conexões SSL no Railway
  },
});

module.exports = pool;
