const pool = require('../config/db');

const getZonas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM zona_pesca ORDER BY zona_id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener zonas de pesca:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getZonaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM zona_pesca WHERE zona_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Zona no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener zona de pesca:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const createZona = async (req, res) => {
    try {
        const { zona_nombre, zona_cuadrante, zona_descripcion, zona_estatus } = req.body;
        const result = await pool.query(
            'INSERT INTO zona_pesca (zona_nombre, zona_cuadrante, zona_descripcion, zona_estatus) VALUES ($1, $2, $3, COALESCE($4, true)) RETURNING *',
            [zona_nombre, zona_cuadrante, zona_descripcion, zona_estatus]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear zona de pesca:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateZona = async (req, res) => {
    try {
        const { id } = req.params;
        const { zona_nombre, zona_cuadrante, zona_descripcion, zona_estatus } = req.body;
        const result = await pool.query(
            'UPDATE zona_pesca SET zona_nombre = $1, zona_cuadrante = $2, zona_descripcion = $3, zona_estatus = COALESCE($4, true) WHERE zona_id = $5 RETURNING *',
            [zona_nombre, zona_cuadrante, zona_descripcion, zona_estatus, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Zona no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar zona de pesca:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const deleteZona = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM zona_pesca WHERE zona_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Zona no encontrada' });
        res.json({ message: 'Zona de pesca eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar zona de pesca:', error);
        res.status(500).json({ error: 'Error al eliminar. Posible violación de llave foránea.' });
    }
};

module.exports = {
    getZonas,
    getZonaById,
    createZona,
    updateZona,
    deleteZona
};
