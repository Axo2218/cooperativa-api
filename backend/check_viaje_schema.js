const pool = require('./src/config/db');

async function checkSchema() {
    try {
        const res = await pool.query(`
            SELECT 
                a.attname AS column_name,
                format_type(a.atttypid, a.atttypmod) AS data_type,
                a.attnotnull AS not_null,
                i.indisprimary AS is_primary
            FROM 
                pg_index i
            JOIN 
                pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
            WHERE 
                i.indrelid = 'viaje'::regclass;
        `);
        console.log('--- Llaves de la tabla viaje ---');
        console.log(res.rows);
        
        const cols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'viaje'");
        console.log('--- Todas las columnas ---');
        console.log(cols.rows);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkSchema();
