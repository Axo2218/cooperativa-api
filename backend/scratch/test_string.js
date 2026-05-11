const pool = require('../src/config/db');
async function test() {
    try {
        const res = await pool.query("INSERT INTO viaje (via_presupuesto_estimado, via_fk_embarcacion, via_fk_capitan) VALUES ($1, $2, $3) RETURNING *", ['3485.07', 3, 18]);
        console.log('SUCCESS');
    } catch (e) {
        console.error(e.message);
    } finally {
        process.exit(0);
    }
}
test();
