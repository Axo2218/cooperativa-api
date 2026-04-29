const pool = require('../config/db');

// Obtener todos los tipos de activo
const getTiposActivo = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cat_tipo_activo ORDER BY tip_act_id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener tipos de activo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un tipo de activo por ID
const getTipoActivoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM cat_tipo_activo WHERE tip_act_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Tipo de activo no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el tipo de activo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un tipo de activo
const createTipoActivo = async (req, res) => {
    try {
        const { tip_act_nombre } = req.body;
        const result = await pool.query(
            'INSERT INTO cat_tipo_activo (tip_act_nombre) VALUES ($1) RETURNING *',
            [tip_act_nombre]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear tipo de activo:', error);
        if (error.code === '23505') { // Unique constraint violation
            return res.status(400).json({ error: 'El nombre del tipo de activo ya existe' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un tipo de activo
const updateTipoActivo = async (req, res) => {
    try {
        const { id } = req.params;
        const { tip_act_nombre } = req.body;

        const result = await pool.query(
            'UPDATE cat_tipo_activo SET tip_act_nombre = $1 WHERE tip_act_id = $2 RETURNING *',
            [tip_act_nombre, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Tipo de activo no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar tipo de activo:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El nombre del tipo de activo ya existe' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un tipo de activo
const deleteTipoActivo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM cat_tipo_activo WHERE tip_act_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Tipo de activo no encontrado' });
        res.json({ message: 'Tipo de activo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar tipo de activo:', error);
        if (error.code === '23503') { // Foreign key constraint violation
            return res.status(400).json({ error: 'No se puede eliminar porque está en uso por uno o más activos fijos' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getTiposActivo,
    getTipoActivoById,
    createTipoActivo,
    updateTipoActivo,
    deleteTipoActivo
};
