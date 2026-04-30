const pool = require('./src/config/db');

async function checkDependencies() {
    try {
        const inst = await pool.query('SELECT inst_id FROM instalacion LIMIT 1');
        console.log('Instalacion ID:', inst.rows[0]?.inst_id);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
checkDependencies();
