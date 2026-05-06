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
  try {
    const res = await pool.query(`
      SELECT i.ins_id, i.ins_nombre, c.cat_ins_nombre as ins_categoria, u.uni_nombre as ins_unidad_medida, i.ins_costo_unitario_referencia, i.ins_estatus, i.ins_fkcategoria, i.ins_fkunidad,
             SUM(COALESCE(inv.inv_cantidad_actual, 0)) AS ins_stock_actual,
             0 AS ins_stock_minimo
      FROM insumo i
      LEFT JOIN categoria_insumo c ON i.ins_fkcategoria = c.cat_ins_id
      LEFT JOIN unidad_medida u ON i.ins_fkunidad = u.uni_id
      LEFT JOIN inventario_insumos inv ON i.ins_id = inv.inv_fk_insumo
      GROUP BY i.ins_id, i.ins_nombre, c.cat_ins_nombre, u.uni_nombre, i.ins_costo_unitario_referencia, i.ins_estatus, i.ins_fkcategoria, i.ins_fkunidad
      ORDER BY i.ins_id ASC
    `);
    console.log(res.rows);
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    pool.end();
  }
}
check();
