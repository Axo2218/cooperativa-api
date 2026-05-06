const pool = require('./src/config/db');

async function checkViajes() {
    try {
        const res = await pool.query("SELECT via_id, via_estatus FROM viaje WHERE via_estatus != 'Completado' AND via_archivado = false");
        console.log('--- Viajes Activos ---');
        console.log(res.rows);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkViajes();
