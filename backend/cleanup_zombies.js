const pool = require('./src/config/db');

async function cleanup() {
    try {
        const res = await pool.query("UPDATE viaje SET via_estatus = 'Completado' WHERE via_id IN (20, 21, 22)");
        console.log('Saneamiento completado:', res.rowCount, 'registros de viaje cerrados.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
cleanup();
