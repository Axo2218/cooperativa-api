const pool = require('./src/config/db');
async function check() {
    console.log("--- INSUMO ---");
    const insumo = await pool.query("SELECT * FROM information_schema.columns WHERE table_name = 'insumo'");
    console.table(insumo.rows.map(c => ({ name: c.column_name, type: c.data_type })));

    console.log("--- INVENTARIO_INSUMOS ---");
    const inv = await pool.query("SELECT * FROM information_schema.columns WHERE table_name = 'inventario_insumos'");
    console.table(inv.rows.map(c => ({ name: c.column_name, type: c.data_type })));

    process.exit(0);
}
check();
