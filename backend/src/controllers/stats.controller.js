const pool = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        // 1. Conteos básicos
        const fleetCount = await pool.query('SELECT COUNT(*) FROM embarcacion');
        const activeCount = await pool.query("SELECT COUNT(*) FROM viaje WHERE via_estatus IN ('En Curso', 'Activo') AND via_archivado = false");
        const preparationCount = await pool.query("SELECT COUNT(*) FROM viaje WHERE via_estatus IN ('En Preparación', 'Pendiente') AND via_archivado = false");
        const totalKilos = await pool.query('SELECT SUM(det_cap_kilogramos) FROM viaje_detalle_captura');
        const totalVentas = await pool.query('SELECT SUM(ven_total) FROM venta');
        
        // 2. Detalles de Flota
        const fleetList = await pool.query('SELECT emb_nombre, emb_matricula FROM embarcacion ORDER BY emb_nombre ASC');
        
        // 3. Detalles de Operación (Activos)
        const activeTrips = await pool.query(`
            SELECT v.via_id, e.emb_nombre, v.via_estatus 
            FROM viaje v 
            JOIN embarcacion e ON v.via_fk_embarcacion = e.emb_id 
            WHERE v.via_estatus IN ('En Curso', 'Activo') AND v.via_archivado = false
            ORDER BY v.via_id DESC
        `);

        // 4. Histórico de Producción (Mes a mes)
        const prodHistory = await pool.query(`
            SELECT TO_CHAR(v.via_fecha_salida, 'YYYY-MM') as mes, SUM(d.det_cap_kilogramos) as total
            FROM viaje v
            JOIN viaje_detalle_captura d ON v.via_id = d.det_cap_fk_viaje
            GROUP BY mes
            ORDER BY mes ASC
            LIMIT 12
        `);

        // 5. Histórico de Ingresos (Mes a mes)
        const revHistory = await pool.query(`
            SELECT TO_CHAR(ven_fecha, 'YYYY-MM') as mes, SUM(ven_total) as total
            FROM venta
            GROUP BY mes
            ORDER BY mes ASC
            LIMIT 12
        `);

        // 6. Personal por Estatus (Fixed boolean comparison)
        const personalStats = await pool.query(`
            SELECT 
                CASE WHEN per_estatus = true THEN 'Activo' ELSE 'Inactivo' END as estatus, 
                COUNT(*)::int as count 
            FROM personal 
            GROUP BY per_estatus
        `);

        // 7. Ventas por Cooperativa (Leaderboard)
        const coopSales = await pool.query(`
            SELECT c.coop_nombre, COALESCE(SUM(v.ven_total), 0) as total
            FROM cooperativa c
            LEFT JOIN venta v ON v.ven_fk_cooperativa = c.coop_id
            GROUP BY c.coop_nombre
            ORDER BY total DESC
        `);

        // 8. Fuerza Laboral por Cooperativa (Fixed boolean comparison)
        const workforceStats = await pool.query(`
            SELECT 
                c.coop_nombre,
                COUNT(p.per_id) FILTER (WHERE p.per_estatus = true)::int as activos,
                COUNT(p.per_id) FILTER (WHERE p.per_estatus = false)::int as inactivos
            FROM cooperativa c
            LEFT JOIN personal p ON c.coop_id = p.per_fk_cooperativa
            GROUP BY c.coop_nombre
            ORDER BY c.coop_nombre ASC
        `);

        // 9. Producción por Cooperativa (Leaderboard de Capturas)
        const coopProduction = await pool.query(`
            SELECT c.coop_nombre, COALESCE(SUM(d.det_cap_kilogramos), 0)::float as total
            FROM cooperativa c
            LEFT JOIN embarcacion e ON e.emb_fk_cooperativa = c.coop_id
            LEFT JOIN viaje v ON v.via_fk_embarcacion = e.emb_id
            LEFT JOIN viaje_detalle_captura d ON v.via_id = d.det_cap_fk_viaje
            GROUP BY c.coop_nombre
            ORDER BY total DESC
        `);

        res.json({
            // Resumen (KPIs principales)
            totalEmbarcaciones: parseInt(fleetCount.rows[0].count),
            viajesActivos: parseInt(activeCount.rows[0].count),
            viajesPreparacion: parseInt(preparationCount.rows[0].count),
            totalKilos: parseFloat(totalKilos.rows[0].sum || 0).toFixed(2),
            totalVentas: parseFloat(totalVentas.rows[0].sum || 0).toFixed(2),
            
            // Datos para Drills
            fleetList: fleetList.rows,
            activeTrips: activeTrips.rows,
            productionHistory: prodHistory.rows,
            revenueHistory: revHistory.rows,
            personalStats: personalStats.rows,
            coopSales: coopSales.rows,
            workforceStats: workforceStats.rows,
            coopProduction: coopProduction.rows
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getVesselStats = async (req, res) => {
    try {
        const { id } = req.params; // ID de embarcacion
        const result = await pool.query(`
            SELECT 
                TO_CHAR(v.via_fecha_llegada, 'DD/MM') as fecha,
                SUM(dc.det_cap_kilogramos) as kilos,
                SUM(dc.det_cap_kilogramos * dc.det_cap_precio_pactado) as ingresos
            FROM viaje v
            JOIN viaje_detalle_captura dc ON v.via_id = dc.det_cap_fk_viaje
            WHERE v.via_fk_embarcacion = $1 AND v.via_estatus = 'Completado'
            GROUP BY fecha, v.via_fecha_llegada
            ORDER BY v.via_fecha_llegada ASC
            LIMIT 10
        `, [id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener estadísticas del barco:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { getDashboardStats, getVesselStats };
