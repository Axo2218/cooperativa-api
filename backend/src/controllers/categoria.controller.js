const pool = require('../config/db');

// OBTENER TODAS (GET)
const obtenerCategorias = async (req, res) => {
    try {
        const respuesta = await pool.query("SELECT * FROM categoria_especie ORDER BY cat_esp_id ASC");
        res.status(200).json(respuesta.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// OBTENER UNA SOLA POR ID (GET)
const obtenerCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const respuesta = await pool.query("SELECT * FROM categoria_especie WHERE cat_esp_id = $1", [id]);
        if (respuesta.rows.length === 0) return res.status(404).json({ mensaje: "Categoría no encontrada" });
        res.status(200).json(respuesta.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar la categoría' });
    }
};

// CREAR (POST)
const crearCategoria = async (req, res) => {
    try {
        const { cat_esp_nombre } = req.body;
        const nuevaCategoria = await pool.query(
            "INSERT INTO categoria_especie (cat_esp_nombre) VALUES ($1) RETURNING *",
            [cat_esp_nombre]
        );
        res.status(201).json(nuevaCategoria.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la categoría' });
    }
};

// ACTUALIZAR (PUT)
const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { cat_esp_nombre } = req.body;
        const actualizar = await pool.query(
            "UPDATE categoria_especie SET cat_esp_nombre = $1 WHERE cat_esp_id = $2 RETURNING *",
            [cat_esp_nombre, id]
        );
        if (actualizar.rows.length === 0) return res.status(404).json({ mensaje: "Categoría no encontrada" });
        res.status(200).json(actualizar.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
};

// ELIMINAR (DELETE)
const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminar = await pool.query("DELETE FROM categoria_especie WHERE cat_esp_id = $1 RETURNING *", [id]);
        if (eliminar.rows.length === 0) return res.status(404).json({ mensaje: "Categoría no encontrada" });
        res.status(200).json({ mensaje: "Categoría eliminada con éxito, Capitán" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar. Verifica que no esté en uso." });
    }
};

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};