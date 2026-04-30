const pool = require('./src/config/db');
pool.query(`
    SELECT column_name, is_nullable, column_default, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'embarcacion'
`).then(r => {
    console.table(r.rows);
    process.exit(0);
});
