const pool = require('./src/config/db');
async function check() {
    const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_name LIKE '%insumo%'");
    console.log("Tablas Insumo:", tables.rows.map(t => t.table_name));
    process.exit(0);
}
check();
