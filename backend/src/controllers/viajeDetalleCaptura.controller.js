const pool = require('../config/db');

// Obtener todas las capturas registradas
const getCapturas = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                dc.*, 
                v.via_fecha_salida,
                v.via_estatus,
                v.via_fk_embarcacion,
                emb.emb_nombre AS barco,
                e.esp_nombre_comun,
                (dc.det_cap_kilogramos * dc.det_cap_precio_pactado) AS det_cap_subtotal
            FROM viaje_detalle_captura dc
            LEFT JOIN viaje v ON dc.det_cap_fk_viaje = v.via_id
            LEFT JOIN embarcacion emb ON v.via_fk_embarcacion = emb.emb_id
            LEFT JOIN especie e ON dc.det_cap_fk_especie = e.esp_id
            ORDER BY dc.det_cap_id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener las capturas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener una captura por ID
const getCapturaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT 
                dc.*,
                (dc.det_cap_kilogramos * dc.det_cap_precio_pactado) AS det_cap_subtotal
            FROM viaje_detalle_captura dc 
            WHERE det_cap_id = $1
        `, [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro de captura no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la captura:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener capturas por ID de viaje (Ideal para vistas detalle de viaje)
const getCapturasByViajeId = async (req, res) => {
    try {
        const { viajeId } = req.params;
        const result = await pool.query(`
            SELECT 
                dc.*, 
                e.esp_nombre_comun,
                (dc.det_cap_kilogramos * dc.det_cap_precio_pactado) AS det_cap_subtotal
            FROM viaje_detalle_captura dc
            LEFT JOIN especie e ON dc.det_cap_fk_especie = e.esp_id
            WHERE dc.det_cap_fk_viaje = $1
            ORDER BY dc.det_cap_id ASC
        `, [viajeId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener capturas del viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear una captura
const createCaptura = async (req, res) => {
    try {
        const {
            det_cap_fk_viaje,
            det_cap_fk_especie,
            det_cap_kilogramos,
            det_cap_precio_pactado
        } = req.body;

        const result = await pool.query(
            `INSERT INTO viaje_detalle_captura 
            (det_cap_fk_viaje, det_cap_fk_especie, det_cap_kilogramos, det_cap_precio_pactado) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [det_cap_fk_viaje, det_cap_fk_especie, det_cap_kilogramos, det_cap_precio_pactado]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al registrar captura:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar una captura
const updateCaptura = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            det_cap_fk_viaje,
            det_cap_fk_especie,
            det_cap_kilogramos,
            det_cap_precio_pactado
        } = req.body;

        const result = await pool.query(
            `UPDATE viaje_detalle_captura 
            SET det_cap_fk_viaje = $1, 
                det_cap_fk_especie = $2, 
                det_cap_kilogramos = $3, 
                det_cap_precio_pactado = $4 
            WHERE det_cap_id = $5 RETURNING *`,
            [det_cap_fk_viaje, det_cap_fk_especie, det_cap_kilogramos, det_cap_precio_pactado, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro de captura no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar captura:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar una captura
const deleteCaptura = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM viaje_detalle_captura WHERE det_cap_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro de captura no encontrado' });
        res.json({ message: 'Registro de captura eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar captura:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getCapturas,
    getCapturaById,
    getCapturasByViajeId,
    createCaptura,
    updateCaptura,
    deleteCaptura
};
