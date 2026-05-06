const pool = require('./src/config/db');

async function debugSpecificViajes() {
    try {
        const res = await pool.query("SELECT via_id, via_estatus, via_archivado FROM viaje WHERE via_id IN (20, 21, 22)");
        console.log('--- Viajes 20, 21, 22 ---');
        console.table(res.rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
debugSpecificViajes();
