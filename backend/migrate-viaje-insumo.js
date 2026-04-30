const pool = require('./src/config/db');
async function createTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS viaje_insumo (
                vi_id SERIAL PRIMARY KEY, 
                vi_fk_viaje INTEGER REFERENCES viaje(via_id), 
                vi_fk_insumo INTEGER REFERENCES insumo(ins_id), 
                vi_cantidad NUMERIC NOT NULL, 
                vi_fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabla viaje_insumo creada o ya existente.');
    } catch (e) {
        console.error('Error al crear tabla:', e);
    } finally {
        process.exit(0);
    }
}
createTable();
