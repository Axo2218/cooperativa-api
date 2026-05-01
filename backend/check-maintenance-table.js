const pool = require('./src/config/db');

async function checkTable() {
    try {
        const result = await pool.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mantenimiento_embarcacion')");
        console.log('Existe mantenimiento_embarcacion:', result.rows[0].exists);
        
        const result2 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'mantenimiento_embarcacion'");
        console.log('Columnas:', result2.rows.map(r => r.column_name));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

checkTable();
