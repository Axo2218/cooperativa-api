const pool = require('./src/config/db');

async function updateViajeSchema() {
    try {
        console.log('Actualizando esquema de viajes...');
        const columns = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'viaje'");
        const columnNames = columns.rows.map(c => c.column_name);

        if (!columnNames.includes('via_total_kg')) {
            await pool.query('ALTER TABLE viaje ADD COLUMN via_total_kg DECIMAL(10,2) DEFAULT 0');
        }
        if (!columnNames.includes('via_total_ingresos')) {
            await pool.query('ALTER TABLE viaje ADD COLUMN via_total_ingresos DECIMAL(10,2) DEFAULT 0');
        }
        console.log('Esquema actualizado.');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
updateViajeSchema();
