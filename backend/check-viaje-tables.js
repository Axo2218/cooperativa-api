const pool = require('./src/config/db');
async function check() {
    console.log("--- VIAJE_CONSUMIBLE ---");
    const vc = await pool.query("SELECT * FROM information_schema.columns WHERE table_name = 'viaje_consumible'");
    console.table(vc.rows.map(c => ({ name: c.column_name, type: c.data_type })));

    console.log("--- VIAJE_RECURSO ---");
    const vr = await pool.query("SELECT * FROM information_schema.columns WHERE table_name = 'viaje_recurso'");
    console.table(vr.rows.map(c => ({ name: c.column_name, type: c.data_type })));

    process.exit(0);
}
check();
