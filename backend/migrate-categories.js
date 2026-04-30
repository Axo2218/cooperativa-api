const pool = require('./src/config/db');

async function setupCategories() {
    try {
        console.log('Iniciando migración de categorías...');

        // 1. Crear tabla de categorías
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categoria_embarcacion (
                cat_id SERIAL PRIMARY KEY,
                cat_nombre VARCHAR(50) NOT NULL,
                cat_descripcion TEXT,
                cat_capacidad_sugerida DECIMAL(10,2)
            )
        `);

        // 2. Insertar categorías base
        const categories = [
            ['Lancha Motor', 'Pequeña embarcación costera', 800],
            ['Panga Pesquera', 'Embarcación mediana para pesca artesanal', 1500],
            ['Atunero Menor', 'Barco especializado en atún de mediana escala', 15000],
            ['Buque Factoría', 'Gran embarcación con procesamiento industrial', 150000],
            ['Camaronero', 'Especializado en arrastre de camarón', 5000]
        ];

        for (const [nombre, desc, cap] of categories) {
            await pool.query(
                'INSERT INTO categoria_embarcacion (cat_nombre, cat_descripcion, cat_capacidad_sugerida) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                [nombre, desc, cap]
            );
        }

        // 3. Modificar tabla embarcacion
        // Primero verificamos si las columnas existen para evitar errores
        const columns = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'embarcacion'");
        const columnNames = columns.rows.map(c => c.column_name);

        if (!columnNames.includes('emb_fk_categoria')) {
            await pool.query('ALTER TABLE embarcacion ADD COLUMN emb_fk_categoria INTEGER REFERENCES categoria_embarcacion(cat_id)');
        }
        
        if (!columnNames.includes('emb_capacidad_carga')) {
            await pool.query('ALTER TABLE embarcacion ADD COLUMN emb_capacidad_carga DECIMAL(10,2) DEFAULT 0');
        }

        // 4. Asignar categorías y capacidades coherentes a los barcos actuales
        const barcos = await pool.query('SELECT emb_id, emb_nombre FROM embarcacion');
        
        for (const barco of barcos.rows) {
            let catId = 1; // Default Lancha
            let capacidad = 800;

            if (barco.emb_nombre.includes('Tritón') || barco.emb_nombre.includes('Mar de Plata')) {
                catId = 3; // Atunero
                capacidad = 12000;
            } else if (barco.emb_nombre.includes('Gaviota')) {
                catId = 2; // Panga
                capacidad = 1800;
            } else if (barco.emb_nombre.includes('Rayo') || barco.emb_nombre.includes('Guardián')) {
                catId = 5; // Camaronero
                capacidad = 6000;
            } else {
                catId = 1; // Lancha
                capacidad = 950;
            }

            await pool.query(
                'UPDATE embarcacion SET emb_fk_categoria = $1, emb_capacidad_carga = $2 WHERE emb_id = $3',
                [catId, capacidad, barco.emb_id]
            );
        }

        console.log('Migración completada con éxito.');
    } catch (error) {
        console.error('Error en la migración:', error);
    } finally {
        process.exit(0);
    }
}

setupCategories();
