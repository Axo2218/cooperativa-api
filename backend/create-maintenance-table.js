const pool = require('./src/config/db');

async function createTable() {
    try {
        console.log('Creando tabla mantenimiento_embarcacion...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS mantenimiento_embarcacion (
                mant_id SERIAL PRIMARY KEY,
                mant_fk_embarcacion INTEGER REFERENCES embarcacion(emb_id),
                mant_fecha_inicio DATE DEFAULT CURRENT_DATE,
                mant_fecha_fin DATE,
                mant_descripcion TEXT,
                mant_costo NUMERIC(12, 2) DEFAULT 0,
                mant_estado VARCHAR(20) DEFAULT 'En Proceso'
            );
        `);
        console.log('Tabla creada exitosamente.');
    } catch (error) {
        console.error('Error al crear la tabla:', error);
    } finally {
        pool.end();
    }
}

createTable();
