const pool = require('../config/db');

// Obtener toda la tripulación registrada en los viajes
const getTripulacion = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                vp.*, 
                v.via_fecha_salida,
                v.via_estatus,
                p.per_nombre || ' ' || p.per_apellidos AS personal_nombre,
                r.rol_nombre,
                r.rol_puntos_reparto
            FROM viaje_personal vp
            LEFT JOIN viaje v ON vp.via_per_fk_viaje = v.via_id
            LEFT JOIN personal p ON vp.via_per_fk_personal = p.per_id
            LEFT JOIN rol r ON vp.via_per_fk_rol = r.rol_id
            ORDER BY vp.via_per_id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener la tripulación de los viajes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un registro por ID
const getTripulanteById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM viaje_personal WHERE via_per_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro de tripulante no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el tripulante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener tripulación por ID de viaje (Crítico para calcular la liquidación de puntos)
const getTripulacionByViajeId = async (req, res) => {
    try {
        const { viajeId } = req.params;
        const result = await pool.query(`
            SELECT 
                vp.*, 
                p.per_nombre || ' ' || p.per_apellidos AS personal_nombre,
                r.rol_nombre,
                r.rol_puntos_reparto
            FROM viaje_personal vp
            LEFT JOIN personal p ON vp.via_per_fk_personal = p.per_id
            LEFT JOIN rol r ON vp.via_per_fk_rol = r.rol_id
            WHERE vp.via_per_fk_viaje = $1
            ORDER BY r.rol_puntos_reparto DESC, vp.via_per_id ASC
        `, [viajeId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener tripulación del viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Asignar un tripulante a un viaje
const createTripulante = async (req, res) => {
    try {
        const { via_per_fk_viaje, via_per_fk_personal, via_per_fk_rol } = req.body;

        // Validar si el tripulante ya está asignado a este viaje
        const existe = await pool.query(
            'SELECT 1 FROM viaje_personal WHERE via_per_fk_viaje = $1 AND via_per_fk_personal = $2',
            [via_per_fk_viaje, via_per_fk_personal]
        );
        
        if (existe.rows.length > 0) {
            return res.status(400).json({ error: 'Este tripulante ya está enrolado en este viaje.' });
        }

        const result = await pool.query(
            `INSERT INTO viaje_personal 
            (via_per_fk_viaje, via_per_fk_personal, via_per_fk_rol) 
            VALUES ($1, $2, $3) RETURNING *`,
            [via_per_fk_viaje, via_per_fk_personal, via_per_fk_rol]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al registrar tripulante en viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un rol/asignación de tripulante
const updateTripulante = async (req, res) => {
    try {
        const { id } = req.params;
        const { via_per_fk_viaje, via_per_fk_personal, via_per_fk_rol } = req.body;

        const result = await pool.query(
            `UPDATE viaje_personal 
            SET via_per_fk_viaje = $1, 
                via_per_fk_personal = $2, 
                via_per_fk_rol = $3 
            WHERE via_per_id = $4 RETURNING *`,
            [via_per_fk_viaje, via_per_fk_personal, via_per_fk_rol, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro de tripulante no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar tripulante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un tripulante del viaje
const deleteTripulante = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM viaje_personal WHERE via_per_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro de tripulante no encontrado' });
        res.json({ message: 'Tripulante desembarcado del viaje exitosamente' });
    } catch (error) {
        console.error('Error al eliminar tripulante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getTripulacion,
    getTripulanteById,
    getTripulacionByViajeId,
    createTripulante,
    updateTripulante,
    deleteTripulante
};
