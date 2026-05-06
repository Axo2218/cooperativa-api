const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
async function check() {
  const res = await pool.query("SELECT * FROM insumo LIMIT 5;");
  console.log('Insumo records:', res.rows);
  const res2 = await pool.query("SELECT * FROM categoria_insumo LIMIT 5;");
  console.log('Categoria records:', res2.rows);
  const res3 = await pool.query("SELECT * FROM unidad_medida LIMIT 5;");
  console.log('Unidad records:', res3.rows);
  pool.end();
}
check();
