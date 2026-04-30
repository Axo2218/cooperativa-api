const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function migrateAndSeed() {
    try {
        console.log('--- Iniciando Migración y Poblamiento ---');

        // 1. Añadir salario base a personal
        await pool.query('ALTER TABLE personal ADD COLUMN IF NOT EXISTS per_salario_base DECIMAL(10,2) DEFAULT 0');
        await pool.query('UPDATE personal SET per_salario_base = CASE WHEN per_fk_rol = 1 THEN 5500.00 ELSE 3200.00 END');
        console.log('✅ Salarios base configurados en personal.');

        // 2. Limpiar e insertar insumos categorizados
        const insumos = [
            // OPERATIVOS
            ['Diésel Marino Especial', 'Operativos', 'Litros', 24.50],
            ['Aceite para Motor 2T', 'Operativos', 'Litros', 120.00],
            ['Gasolina Magna (Auxiliar)', 'Operativos', 'Litros', 22.10],
            ['Grasa Náutica Especial', 'Operativos', 'Tarro', 450.00],
            ['Filtro de Combustible', 'Operativos', 'Pieza', 890.00],
            
            // PESCA
            ['Red de Cerco 50m', 'Pesca', 'Pieza', 12500.00],
            ['Caña de Carbono Pro', 'Pesca', 'Pieza', 3400.00],
            ['Cebo (Sardina Fresca)', 'Pesca', 'Kilogramos', 45.00],
            ['Cebo (Calamar)', 'Pesca', 'Kilogramos', 85.00],
            ['Anzuelos de Acero (Caja)', 'Pesca', 'Caja', 210.00],
            ['Hielo en Escamas', 'Pesca', 'Toneladas', 1200.00],
            
            // MATERIALES
            ['Cuerda de Nylon 3/4', 'Materiales', 'Metros', 35.00],
            ['Bengalas de Emergencia', 'Materiales', 'Kit', 1200.00],
            ['Chaleco Salvavidas Pro', 'Materiales', 'Pieza', 1500.00],
            ['Kit de Primeros Auxilios', 'Materiales', 'Pieza', 850.00],
            ['Caja de Herramientas Básica', 'Materiales', 'Pieza', 2100.00],
            ['Víveres de Rancho', 'Materiales', 'Canasta', 4500.00]
        ];

        for (const [nombre, cat, unidad, costo] of insumos) {
            await pool.query(`
                INSERT INTO insumo (ins_nombre, ins_categoria, ins_unidad_medida, ins_costo_unitario_referencia)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (ins_nombre) DO UPDATE 
                SET ins_categoria = $2, ins_unidad_medida = $3, ins_costo_unitario_referencia = $4
            `, [nombre, cat, unidad, costo]);
        }
        console.log('✅ Insumos categorizados insertados/actualizados.');

        // 3. Poblar inventario en todas las instalaciones
        const bodegasRes = await pool.query('SELECT inst_id FROM instalacion');
        const insumosRes = await pool.query('SELECT ins_id FROM insumo');

        for (const bodega of bodegasRes.rows) {
            for (const insumo of insumosRes.rows) {
                const stockAleatorio = Math.floor(Math.random() * 5000) + 100;
                await pool.query(`
                    INSERT INTO inventario_insumos (inv_fk_instalacion, inv_fk_insumo, inv_cantidad_actual)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (inv_fk_instalacion, inv_fk_insumo) DO UPDATE
                    SET inv_cantidad_actual = EXCLUDED.inv_cantidad_actual
                `, [bodega.inst_id, insumo.ins_id, stockAleatorio]);
            }
        }
        console.log('✅ Inventario distribuido en todas las instalaciones.');

    } catch (error) {
        console.error('❌ Error en migración:', error);
    } finally {
        await pool.end();
    }
}

migrateAndSeed();
