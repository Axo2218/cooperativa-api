const pool = require('../config/db');

// OBTENER TODAS (GET)
const getUnidadesMedida = async (req, res) => {
    try {
        const respuesta = await pool.query("SELECT * FROM unidad_medida ORDER BY uni_nombre ASC");
        res.status(200).json(respuesta.rows);
    } catch (error) {
        console.error('Error al obtener unidades de medida:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getUnidadesMedida
};
