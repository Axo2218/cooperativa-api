const pool = require('../config/db');

// Obtener todas las instalaciones (muelles, bodegas, oficinas, etc.)
const getInstalaciones = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM instalacion ORDER BY inst_nombre ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener instalaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getInstalaciones
};
