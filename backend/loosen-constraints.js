const pool = require('./src/config/db');

async function loosenConstraints() {
    try {
        console.log('Relajando restricciones de columnas legacy...');
        await pool.query('ALTER TABLE embarcacion ALTER COLUMN emb_categoria DROP NOT NULL');
        await pool.query('ALTER TABLE embarcacion ALTER COLUMN emb_capacidad_kg DROP NOT NULL');
        await pool.query('ALTER TABLE embarcacion ALTER COLUMN emb_fk_instalacion_base DROP NOT NULL');
        await pool.query('ALTER TABLE embarcacion ALTER COLUMN emb_capacidad_personal DROP NOT NULL');
        console.log('Restricciones relajadas exitosamente.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

loosenConstraints();
