const pool = require('./src/config/db');

async function fixColumns() {
    try {
        console.log('Verificando columnas faltantes...');
        const columns = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'embarcacion'");
        const columnNames = columns.rows.map(c => c.column_name);

        if (!columnNames.includes('emb_eslora')) {
            console.log('Añadiendo emb_eslora...');
            await pool.query('ALTER TABLE embarcacion ADD COLUMN emb_eslora DECIMAL(10,2)');
        }
        if (!columnNames.includes('emb_manga')) {
            console.log('Añadiendo emb_manga...');
            await pool.query('ALTER TABLE embarcacion ADD COLUMN emb_manga DECIMAL(10,2)');
        }
        if (!columnNames.includes('emb_tipo_motor')) {
            console.log('Añadiendo emb_tipo_motor...');
            await pool.query('ALTER TABLE embarcacion ADD COLUMN emb_tipo_motor VARCHAR(100)');
        }

        console.log('Columnas verificadas y corregidas.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

fixColumns();
