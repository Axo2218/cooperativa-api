const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Get all unique categories and units from insumo
    console.log('Extracting distinct categories and units from insumo...');
    const categoriesRes = await client.query('SELECT DISTINCT ins_categoria FROM insumo WHERE ins_categoria IS NOT NULL');
    const unitsRes = await client.query('SELECT DISTINCT ins_unidad_medida FROM insumo WHERE ins_unidad_medida IS NOT NULL');

    // 2. Insert missing categories
    console.log('Inserting missing categories...');
    for (const row of categoriesRes.rows) {
      const catName = row.ins_categoria.trim();
      const existCat = await client.query('SELECT cat_ins_id FROM categoria_insumo WHERE LOWER(cat_ins_nombre) = LOWER($1)', [catName]);
      if (existCat.rowCount === 0) {
        await client.query('INSERT INTO categoria_insumo (cat_ins_nombre) VALUES ($1)', [catName]);
      }
    }

    // 3. Insert missing units
    console.log('Inserting missing units...');
    for (const row of unitsRes.rows) {
      const uniName = row.ins_unidad_medida.trim();
      // Use singular/plural approximations or just insert directly
      const existUni = await client.query('SELECT uni_id FROM unidad_medida WHERE LOWER(uni_nombre) = LOWER($1) OR LOWER(uni_abreviatura) = LOWER($1)', [uniName]);
      if (existUni.rowCount === 0) {
        await client.query('INSERT INTO unidad_medida (uni_nombre, uni_abreviatura) VALUES ($1, $2)', [uniName, uniName.substring(0, 4)]);
      }
    }

    // 4. Add new columns
    console.log('Adding new columns to insumo...');
    await client.query('ALTER TABLE insumo ADD COLUMN IF NOT EXISTS ins_fkcategoria INT');
    await client.query('ALTER TABLE insumo ADD COLUMN IF NOT EXISTS ins_fkunidad INT');

    // 5. Update foreign keys
    console.log('Updating foreign keys in insumo...');
    
    // Update categories
    const allInsumos = await client.query('SELECT ins_id, ins_categoria, ins_unidad_medida FROM insumo');
    for (const insumo of allInsumos.rows) {
      if (insumo.ins_categoria) {
        const catName = insumo.ins_categoria.trim();
        const catRes = await client.query('SELECT cat_ins_id FROM categoria_insumo WHERE LOWER(cat_ins_nombre) = LOWER($1)', [catName]);
        if (catRes.rowCount > 0) {
          await client.query('UPDATE insumo SET ins_fkcategoria = $1 WHERE ins_id = $2', [catRes.rows[0].cat_ins_id, insumo.ins_id]);
        }
      }
      
      if (insumo.ins_unidad_medida) {
        const uniName = insumo.ins_unidad_medida.trim();
        const uniRes = await client.query('SELECT uni_id FROM unidad_medida WHERE LOWER(uni_nombre) = LOWER($1) OR LOWER(uni_abreviatura) = LOWER($1)', [uniName]);
        if (uniRes.rowCount > 0) {
          await client.query('UPDATE insumo SET ins_fkunidad = $1 WHERE ins_id = $2', [uniRes.rows[0].uni_id, insumo.ins_id]);
        }
      }
    }

    // 6. Add foreign key constraints
    console.log('Adding constraints...');
    await client.query('ALTER TABLE insumo ADD CONSTRAINT fk_insumo_categoria FOREIGN KEY (ins_fkcategoria) REFERENCES categoria_insumo(cat_ins_id)');
    await client.query('ALTER TABLE insumo ADD CONSTRAINT fk_insumo_unidad FOREIGN KEY (ins_fkunidad) REFERENCES unidad_medida(uni_id)');

    // 7. Drop old columns
    console.log('Dropping old columns...');
    await client.query('ALTER TABLE insumo DROP COLUMN IF EXISTS ins_categoria');
    await client.query('ALTER TABLE insumo DROP COLUMN IF EXISTS ins_unidad_medida');

    await client.query('COMMIT');
    console.log('Migration completed successfully!');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', e);
  } finally {
    client.release();
    pool.end();
  }
}
migrate();
