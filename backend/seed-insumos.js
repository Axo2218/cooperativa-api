const pool = require('./src/config/db');

async function seed() {
    try {
        console.log("--- INICIANDO SEED DE INSUMOS ---");

        // 1. Crear nuevos insumos si no existen
        const insumosData = [
            ['Redes de Pesca', 'Equipamiento', 'Pieza', 12500.00],
            ['Cañas de Carbono', 'Equipamiento', 'Pieza', 3200.00],
            ['Cebo (Sardina)', 'Cebos', 'Kg', 45.00],
            ['Cebo (Calamar)', 'Cebos', 'Kg', 85.00],
            ['Diésel Marino', 'Combustible', 'Litro', 23.50],
            ['Hielo en Escama', 'Logística', 'Kg', 2.00],
            ['Víveres de Rancho', 'Logística', 'Canasta', 1500.00]
        ];

        for (const [nombre, cat, unidad, costo] of insumosData) {
            const exists = await pool.query("SELECT * FROM insumo WHERE ins_nombre = $1", [nombre]);
            if (exists.rows.length === 0) {
                await pool.query(`
                    INSERT INTO insumo (ins_nombre, ins_categoria, ins_unidad_medida, ins_costo_unitario_referencia, ins_estatus)
                    VALUES ($1, $2, $3, $4, true)
                `, [nombre, cat, unidad, costo]);
            }
        }

        // Obtener todos los insumos actuales
        const allInsumos = await pool.query("SELECT ins_id FROM insumo");
        
        // Obtener todas las bodegas de las cooperativas
        const bodegas = await pool.query("SELECT coop_fk_instalacion FROM cooperativa WHERE coop_fk_instalacion IS NOT NULL");

        console.log(`Poblando ${bodegas.rows.length} bodegas con ${allInsumos.rows.length} tipos de insumos...`);

        for (const bodega of bodegas.rows) {
            for (const insumo of allInsumos.rows) {
                const invExists = await pool.query("SELECT * FROM inventario_insumos WHERE inv_fk_instalacion = $1 AND inv_fk_insumo = $2", [bodega.coop_fk_instalacion, insumo.ins_id]);
                if (invExists.rows.length === 0) {
                    const cantidad = Math.floor(Math.random() * 4900) + 100;
                    await pool.query(`
                        INSERT INTO inventario_insumos (inv_fk_instalacion, inv_fk_insumo, inv_cantidad_actual, inv_ultima_actualizacion)
                        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                    `, [bodega.coop_fk_instalacion, insumo.ins_id, cantidad]);
                }
            }
        }

        console.log("--- SEED COMPLETADO ---");
    } catch (e) {
        console.error("Error en seed:", e);
    } finally {
        process.exit(0);
    }
}

seed();
