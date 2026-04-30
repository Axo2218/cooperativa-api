const pool = require('./src/config/db');
async function migrate() {
    try {
        await pool.query(`
            ALTER TABLE viaje 
            ADD COLUMN IF NOT EXISTS via_fk_puerto INTEGER REFERENCES instalacion(inst_id)
        `);
        console.log('Columna via_fk_puerto agregada a la tabla viaje.');
    } catch (err) {
        console.error('Error migrando tabla:', err);
    } finally {
        process.exit(0);
    }
}
migrate();
