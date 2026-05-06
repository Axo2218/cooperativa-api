const pool = require('./src/config/db');

async function migrate() {
    try {
        console.log('--- Iniciando Migración del Sistema de Inventario ---');
        
        await pool.query(`
            -- 1. Tabla de Lotes de Pesca
            CREATE TABLE IF NOT EXISTS lote_pesca (
                lote_id SERIAL PRIMARY KEY,
                lote_fk_viaje INTEGER NOT NULL REFERENCES viaje(via_id) ON DELETE CASCADE,
                lote_costo_operativo_total DECIMAL(12, 2) DEFAULT 0,
                lote_kilos_totales_recibidos DECIMAL(12, 2) DEFAULT 0,
                lote_stock_actual DECIMAL(12, 2) DEFAULT 0,
                lote_estatus VARCHAR(20) DEFAULT 'En Venta' CHECK (lote_estatus IN ('En Venta', 'Liquidado')),
                lote_fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- 2. Tabla de Mermas
            CREATE TABLE IF NOT EXISTS merma (
                merma_id SERIAL PRIMARY KEY,
                merma_fk_lote INTEGER NOT NULL REFERENCES lote_pesca(lote_id) ON DELETE CASCADE,
                merma_kilos_perdidos DECIMAL(12, 2) NOT NULL,
                merma_motivo VARCHAR(255),
                merma_fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- 3. Tabla de Ventas de Lote
            CREATE TABLE IF NOT EXISTS venta_lote (
                venta_id SERIAL PRIMARY KEY,
                venta_fk_lote INTEGER NOT NULL REFERENCES lote_pesca(lote_id) ON DELETE CASCADE,
                venta_kilos_vendidos DECIMAL(12, 2) NOT NULL,
                venta_precio_kilo DECIMAL(12, 2) NOT NULL,
                venta_ingreso_total DECIMAL(12, 2) GENERATED ALWAYS AS (venta_kilos_vendidos * venta_precio_kilo) STORED,
                venta_fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Índices para optimización
            CREATE INDEX IF NOT EXISTS idx_lote_viaje ON lote_pesca(lote_fk_viaje);
            CREATE INDEX IF NOT EXISTS idx_merma_lote ON merma(merma_fk_lote);
            CREATE INDEX IF NOT EXISTS idx_venta_lote ON venta_lote(venta_fk_lote);
        `);

        console.log('✅ Tablas y índices creados exitosamente.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        process.exit(1);
    }
}

migrate();
