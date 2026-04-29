const pool = require('../config/db');

// Obtener todos los tipos de instalación
const getTiposInstalacion = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cat_tipo_instalacion ORDER BY tip_inst_id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener tipos de instalación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un tipo de instalación por ID
const getTipoInstalacionById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM cat_tipo_instalacion WHERE tip_inst_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Tipo de instalación no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el tipo de instalación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un tipo de instalación
const createTipoInstalacion = async (req, res) => {
    try {
        const { tip_inst_nombre } = req.body;
        const result = await pool.query(
            'INSERT INTO cat_tipo_instalacion (tip_inst_nombre) VALUES ($1) RETURNING *',
            [tip_inst_nombre]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear tipo de instalación:', error);
        if (error.code === '23505') { // Unique constraint violation
            return res.status(400).json({ error: 'El nombre del tipo de instalación ya existe' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un tipo de instalación
const updateTipoInstalacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { tip_inst_nombre } = req.body;

        const result = await pool.query(
            'UPDATE cat_tipo_instalacion SET tip_inst_nombre = $1 WHERE tip_inst_id = $2 RETURNING *',
            [tip_inst_nombre, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Tipo de instalación no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar tipo de instalación:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El nombre del tipo de instalación ya existe' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un tipo de instalación
const deleteTipoInstalacion = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM cat_tipo_instalacion WHERE tip_inst_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Tipo de instalación no encontrado' });
        res.json({ message: 'Tipo de instalación eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar tipo de instalación:', error);
        if (error.code === '23503') { // Foreign key constraint violation
            return res.status(400).json({ error: 'No se puede eliminar porque está en uso por una o más instalaciones' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getTiposInstalacion,
    getTipoInstalacionById,
    createTipoInstalacion,
    updateTipoInstalacion,
    deleteTipoInstalacion
};
