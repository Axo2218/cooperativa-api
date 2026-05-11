const pool = require('../src/config/db');
async function check() {
    try {
        const res = await pool.query("SELECT table_schema, column_name, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'viaje' ORDER BY table_schema, ordinal_position");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
check();
