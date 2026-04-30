const pool = require('./src/config/db');

async function seed() {
    try {
        console.log('Iniciando carga de datos históricos...');
        
        // Obtenemos IDs de referencia
        const ship = await pool.query('SELECT emb_id FROM embarcacion LIMIT 1');
        const species = await pool.query('SELECT esp_id FROM especie LIMIT 1');
        const client = await pool.query('SELECT cli_id FROM clientes LIMIT 1');
        const captain = await pool.query('SELECT per_id FROM personal LIMIT 1');
        const coop = await pool.query('SELECT coop_id FROM cooperativa LIMIT 1');

        if (!ship.rows[0] || !species.rows[0] || !client.rows[0] || !captain.rows[0] || !coop.rows[0]) {
            console.error('❌ Faltan datos base (barcos, especies, clientes, personal o cooperativa) para realizar la siembra.');
            return;
        }

        const embId = ship.rows[0].emb_id;
        const espId = species.rows[0].esp_id;
        const cliId = client.rows[0].cli_id;
        const perId = captain.rows[0].per_id;
        const coopId = coop.rows[0].coop_id;

        // Generar datos para los últimos 8 meses
        for (let i = 1; i <= 8; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const isoDate = date.toISOString().split('T')[0];

            // 1. Insertar Viaje (Archivado para que no sature el dashboard)
            const viaRes = await pool.query(
                "INSERT INTO viaje (via_fecha_salida, via_fecha_llegada, via_estatus, via_archivado, via_fk_embarcacion, via_fk_capitan, via_presupuesto_estimado) VALUES ($1, $1, 'Completado', true, $2, $3, $4) RETURNING via_id",
                [isoDate, embId, perId, 5000 + (Math.random() * 5000)]
            );
            const viaId = viaRes.rows[0].via_id;

            // 2. Insertar Captura
            await pool.query(
                "INSERT INTO viaje_detalle_captura (det_cap_fk_viaje, det_cap_fk_especie, det_cap_kilogramos, det_cap_precio_pactado) VALUES ($1, $2, $3, $4)",
                [viaId, espId, 300 + (Math.random() * 700), 50 + (Math.random() * 50)]
            );

            // 3. Insertar Venta
            await pool.query(
                "INSERT INTO venta (ven_fecha, ven_total, ven_fk_cliente, ven_fk_cooperativa) VALUES ($1, $2, $3, $4)",
                [isoDate, 20000 + (Math.random() * 80000), cliId, coopId]
            );
        }

        console.log('✅ Datos históricos cargados correctamente.');
    } catch (error) {
        console.error('❌ Error al sembrar datos:', error);
    } finally {
        process.exit(0);
    }
}

seed();
