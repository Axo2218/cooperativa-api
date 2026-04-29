const pool = require('../config/db');

// Obtener todo el historial de pesca (Viajes Completados con Lujo de Detalle)
const getPescaHistorico = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                v.via_id,
                v.via_fecha_salida,
                v.via_fecha_llegada,
                v.via_total_kg,
                v.via_total_ingresos,
                e.emb_nombre,
                e.emb_matricula,
                p_cap.per_nombre || ' ' || p_cap.per_apellidos AS capitan_nombre,
                -- Agregamos la tripulación como una lista
                (SELECT STRING_AGG(p_trip.per_nombre || ' ' || p_trip.per_apellidos, ', ')
                 FROM viaje_personal vp
                 JOIN personal p_trip ON vp.via_per_fk_personal = p_trip.per_id
                 WHERE vp.via_per_fk_viaje = v.via_id) AS tripulacion,
                -- Agregamos las especies capturadas
                (SELECT STRING_AGG(esp.esp_nombre_comun || ' (' || dc.det_cap_kilogramos || 'kg)', ' | ')
                 FROM viaje_detalle_captura dc
                 JOIN especie esp ON dc.det_cap_fk_especie = esp.esp_id
                 WHERE dc.det_cap_fk_viaje = v.via_id) AS detalle_pesca
            FROM viaje v
            LEFT JOIN embarcacion e ON v.via_fk_embarcacion = e.emb_id
            LEFT JOIN personal p_cap ON v.via_fk_capitan = p_cap.per_id
            WHERE v.via_estatus = 'Completado'
            ORDER BY v.via_fecha_llegada DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener el historial de pesca:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un registro por ID
const getPescaHistoricoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM pesca_historico WHERE pes_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro de pesca no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el registro de pesca:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un registro de pesca
const createPescaHistorico = async (req, res) => {
    try {
        const {
            pes_fk_embarcacion,
            pes_fecha_salida,
            pes_fecha_regreso,
            pes_zona_pesca,
            pes_fk_especie_principal,
            pes_kilos_capturados,
            pes_ingreso_estimado
        } = req.body;

        const result = await pool.query(
            `INSERT INTO pesca_historico 
            (pes_fk_embarcacion, pes_fecha_salida, pes_fecha_regreso, pes_zona_pesca, pes_fk_especie_principal, pes_kilos_capturados, pes_ingreso_estimado) 
            VALUES ($1, $2, $3, $4, $5, COALESCE($6, 0), COALESCE($7, 0)) RETURNING *`,
            [
                pes_fk_embarcacion, 
                pes_fecha_salida, 
                pes_fecha_regreso || null, 
                pes_zona_pesca, 
                pes_fk_especie_principal || null, 
                pes_kilos_capturados || 0, 
                pes_ingreso_estimado || 0
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear registro de pesca:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un registro de pesca
const updatePescaHistorico = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            pes_fk_embarcacion,
            pes_fecha_salida,
            pes_fecha_regreso,
            pes_zona_pesca,
            pes_fk_especie_principal,
            pes_kilos_capturados,
            pes_ingreso_estimado
        } = req.body;

        const result = await pool.query(
            `UPDATE pesca_historico 
            SET pes_fk_embarcacion = $1, 
                pes_fecha_salida = $2, 
                pes_fecha_regreso = $3, 
                pes_zona_pesca = $4, 
                pes_fk_especie_principal = $5, 
                pes_kilos_capturados = $6, 
                pes_ingreso_estimado = $7 
            WHERE pes_id = $8 RETURNING *`,
            [
                pes_fk_embarcacion, 
                pes_fecha_salida, 
                pes_fecha_regreso || null, 
                pes_zona_pesca, 
                pes_fk_especie_principal || null, 
                pes_kilos_capturados || 0, 
                pes_ingreso_estimado || 0, 
                id
            ]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro de pesca no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar registro de pesca:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un registro de pesca
const deletePescaHistorico = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM pesca_historico WHERE pes_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro de pesca no encontrado' });
        res.json({ message: 'Registro de pesca eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar registro de pesca:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getPescaHistorico,
    getPescaHistoricoById,
    createPescaHistorico,
    updatePescaHistorico,
    deletePescaHistorico
};
