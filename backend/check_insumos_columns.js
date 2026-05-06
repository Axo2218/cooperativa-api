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
  const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'insumo';");
  console.log('Insumo table columns:', res.rows);

  const resCat = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'categoria_insumo';");
  console.log('categoria_insumo table columns:', resCat.rows);

  const resUni = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'unidad_medida';");
  console.log('unidad_medida table columns:', resUni.rows);
  
  pool.end();
}
check();
