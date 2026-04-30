const pool = require('./src/config/db');
pool.query("SELECT * FROM information_schema.columns WHERE table_name = 'zona_pesca'").then(r => {
    console.table(r.rows.map(c => ({ name: c.column_name, type: c.data_type })));
    process.exit(0);
});
