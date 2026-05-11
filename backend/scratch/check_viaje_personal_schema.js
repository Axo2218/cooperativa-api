require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
async function check() {
    try {
        const res = await pool.query("SELECT column_name, is_nullable, data_type FROM information_schema.columns WHERE table_name = 'viaje_personal'");
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
        process.exit(0);
    }
}
check();
