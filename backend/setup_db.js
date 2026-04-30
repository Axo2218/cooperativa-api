const pool = require('./src/config/db');

async function setup() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS inventario_embarcacion (
                ie_id SERIAL PRIMARY KEY,
                ie_fk_embarcacion INTEGER REFERENCES embarcacion(emb_id) ON DELETE CASCADE,
                ie_fk_insumo INTEGER REFERENCES insumo(ins_id) ON DELETE CASCADE,
                ie_cantidad DECIMAL(10,2) NOT NULL DEFAULT 0,
                ie_ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(ie_fk_embarcacion, ie_fk_insumo)
            );
        `);
        console.log('Tabla inventario_embarcacion creada o ya existe.');
        process.exit(0);
    } catch (err) {
        console.error('Error creando tabla:', err);
        process.exit(1);
    }
}

setup();
