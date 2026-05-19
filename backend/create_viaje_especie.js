require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function run() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS viaje_especie_objetivo (
                veo_fk_viaje INTEGER REFERENCES viaje(via_id) ON DELETE CASCADE,
                veo_fk_especie INTEGER REFERENCES especie(esp_id) ON DELETE CASCADE,
                PRIMARY KEY (veo_fk_viaje, veo_fk_especie)
            );
        `);
        console.log("Tabla viaje_especie_objetivo verificada/creada.");
        
        await client.query('COMMIT');
    } catch(e) {
        await client.query('ROLLBACK');
        console.error(e);
    } finally {
        client.release();
        pool.end();
    }
}
run();
