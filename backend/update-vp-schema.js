const pool = require('./src/config/db');

async function updateVPSchema() {
    try {
        console.log('Actualizando esquema de enrolamiento...');
        const columns = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'viaje_personal'");
        const columnNames = columns.rows.map(c => c.column_name);

        if (!columnNames.includes('via_per_enrolado')) {
            await pool.query('ALTER TABLE viaje_personal ADD COLUMN via_per_enrolado BOOLEAN DEFAULT TRUE');
        }
        console.log('Esquema actualizado.');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
updateVPSchema();
