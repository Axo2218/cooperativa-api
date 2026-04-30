const pool = require('./src/config/db');
async function check() {
    console.log("--- EMBARCACION ---");
    const emb = await pool.query("SELECT * FROM information_schema.columns WHERE table_name = 'embarcacion'");
    console.table(emb.rows.map(c => ({ name: c.column_name, type: c.data_type })));

    console.log("--- COOPERATIVA ---");
    const coop = await pool.query("SELECT * FROM information_schema.columns WHERE table_name = 'cooperativa'");
    console.table(coop.rows.map(c => ({ name: c.column_name, type: c.data_type })));

    console.log("--- INSTALACION ---");
    const inst = await pool.query("SELECT * FROM information_schema.columns WHERE table_name = 'instalacion'");
    console.table(inst.rows.map(c => ({ name: c.column_name, type: c.data_type })));

    process.exit(0);
}
check();
