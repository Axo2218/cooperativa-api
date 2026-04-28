const pool = require('../config/db');

// Obtener todos los roles
const getRoles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM rol ORDER BY rol_id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un rol por ID
const getRolById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM rol WHERE rol_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Rol no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el rol:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un rol
const createRol = async (req, res) => {
    try {
        const { rol_nombre, rol_puntos_reparto } = req.body;
        const result = await pool.query(
            'INSERT INTO rol (rol_nombre, rol_puntos_reparto) VALUES ($1, COALESCE($2, 0)) RETURNING *',
            [rol_nombre, rol_puntos_reparto || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear rol:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ya existe un rol con ese nombre' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un rol
const updateRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol_nombre, rol_puntos_reparto } = req.body;
        const result = await pool.query(
            'UPDATE rol SET rol_nombre = $1, rol_puntos_reparto = $2 WHERE rol_id = $3 RETURNING *',
            [rol_nombre, rol_puntos_reparto || 0, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Rol no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ya existe un rol con ese nombre' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un rol
const deleteRol = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM rol WHERE rol_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Rol no encontrado' });
        res.json({ message: 'Rol eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar rol:', error);
        if (error.code === '23503') {
            return res.status(400).json({ error: 'No se puede eliminar el rol porque está siendo utilizado por personal' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getRoles,
    getRolById,
    createRol,
    updateRol,
    deleteRol
};
