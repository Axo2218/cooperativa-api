const pool = require('../config/db');

// Obtener todas las categorías de especies
const getCategoriasEspecie = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categoria_especie ORDER BY cat_esp_id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener categorías de especie:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener una categoría de especie por ID
const getCategoriaEspecieById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM categoria_especie WHERE cat_esp_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Categoría de especie no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la categoría de especie:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear una categoría de especie
const createCategoriaEspecie = async (req, res) => {
    try {
        const { cat_esp_nombre } = req.body;
        const result = await pool.query(
            'INSERT INTO categoria_especie (cat_esp_nombre) VALUES ($1) RETURNING *',
            [cat_esp_nombre]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear categoría de especie:', error);
        if (error.code === '23505') { // Unique constraint violation
            return res.status(400).json({ error: 'El nombre de la categoría ya existe' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar una categoría de especie
const updateCategoriaEspecie = async (req, res) => {
    try {
        const { id } = req.params;
        const { cat_esp_nombre } = req.body;

        const result = await pool.query(
            'UPDATE categoria_especie SET cat_esp_nombre = $1 WHERE cat_esp_id = $2 RETURNING *',
            [cat_esp_nombre, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Categoría de especie no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar categoría de especie:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El nombre de la categoría ya existe' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar una categoría de especie
const deleteCategoriaEspecie = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM categoria_especie WHERE cat_esp_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Categoría de especie no encontrada' });
        res.json({ message: 'Categoría de especie eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar categoría de especie:', error);
        if (error.code === '23503') { // Foreign key constraint violation
            return res.status(400).json({ error: 'No se puede eliminar porque está en uso por una o más especies' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getCategoriasEspecie,
    getCategoriaEspecieById,
    createCategoriaEspecie,
    updateCategoriaEspecie,
    deleteCategoriaEspecie
};
