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

// Preferir host/porta públicos quando disponíveis (ambiente local)
let pool;
if (process.env.DB_HOST && process.env.DB_PORT && process.env.DB_USER && process.env.DB_NAME && process.env.DB_PASS) {
  console.log("Conectando ao Postgres via host público:", process.env.DB_HOST + ":" + process.env.DB_PORT);
  pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    ssl: { rejectUnauthorized: false },
  });
} else if (process.env.DATABASE_URL) {
  console.log("Conectando ao Postgres via DATABASE_URL");
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  throw new Error("Configuração de banco ausente: defina DB_HOST/DB_PORT/DB_USER/DB_NAME/DB_PASS ou DATABASE_URL");
}

module.exports = pool;
