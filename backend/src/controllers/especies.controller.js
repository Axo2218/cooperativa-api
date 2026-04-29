const pool = require('../config/db');

// Obtener todas las especies
const getEspecies = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.*, c.cat_esp_nombre
            FROM especie e
            LEFT JOIN categoria_especie c ON e.esp_fk_categoria = c.cat_esp_id
            ORDER BY e.esp_id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener especies:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener una especie por ID
const getEspecieById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM especie WHERE esp_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Especie no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la especie:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear una especie
const createEspecie = async (req, res) => {
    try {
        const {
            esp_nombre_comun,
            esp_nombre_cientifico,
            esp_fk_categoria,
            esp_en_veda,
            esp_precio_kilo_referencia
        } = req.body;

        const result = await pool.query(
            `INSERT INTO especie 
            (esp_nombre_comun, esp_nombre_cientifico, esp_fk_categoria, esp_en_veda, esp_precio_kilo_referencia) 
            VALUES ($1, $2, $3, $4, COALESCE($5, 0)) RETURNING *`,
            [esp_nombre_comun, esp_nombre_cientifico, esp_fk_categoria, esp_en_veda || false, esp_precio_kilo_referencia || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear especie:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar una especie
const updateEspecie = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            esp_nombre_comun,
            esp_nombre_cientifico,
            esp_fk_categoria,
            esp_en_veda,
            esp_precio_kilo_referencia
        } = req.body;

        const result = await pool.query(
            `UPDATE especie 
            SET esp_nombre_comun = $1, 
                esp_nombre_cientifico = $2, 
                esp_fk_categoria = $3, 
                esp_en_veda = $4, 
                esp_precio_kilo_referencia = $5 
            WHERE esp_id = $6 RETURNING *`,
            [esp_nombre_comun, esp_nombre_cientifico, esp_fk_categoria, esp_en_veda || false, esp_precio_kilo_referencia || 0, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Especie no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar especie:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar una especie
const deleteEspecie = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM especie WHERE esp_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Especie no encontrada' });
        res.json({ message: 'Especie eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar especie:', error);
        if (error.code === '23503') {
            return res.status(400).json({ error: 'No se puede eliminar porque esta especie está vinculada a detalles de venta o pesca' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getEspecies,
    getEspecieById,
    createEspecie,
    updateEspecie,
    deleteEspecie
};
