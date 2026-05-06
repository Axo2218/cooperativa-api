const pool = require('./src/config/db');

async function debugViajes() {
    try {
        const res = await pool.query("SELECT via_id, via_estatus, via_archivado FROM viaje ORDER BY via_id DESC LIMIT 25");
        console.log('--- Ultimos 25 Viajes ---');
        console.table(res.rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
debugViajes();
