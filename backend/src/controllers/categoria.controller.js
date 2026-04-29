const pool = require('../config/db');

// OBTENER TODAS (GET)
const obtenerCategorias = async (req, res) => {
    try {
        const respuesta = await pool.query("SELECT cat_ins_id AS cat_id, cat_ins_nombre AS cat_nombre, cat_ins_descripcion AS cat_descripcion FROM categoria_insumo ORDER BY cat_ins_id ASC");
        res.status(200).json(respuesta.rows);
    } catch (error) {
        console.error('Error al obtener categorías de insumo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// OBTENER UNA SOLA POR ID (GET)
const obtenerCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const respuesta = await pool.query("SELECT cat_ins_id AS cat_id, cat_ins_nombre AS cat_nombre, cat_ins_descripcion AS cat_descripcion FROM categoria_insumo WHERE cat_ins_id = $1", [id]);
        if (respuesta.rows.length === 0) return res.status(404).json({ mensaje: "Categoría no encontrada" });
        res.status(200).json(respuesta.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar la categoría' });
    }
};

// CREAR (POST)
const crearCategoria = async (req, res) => {
    try {
        const { cat_nombre, cat_descripcion } = req.body;
        const nuevaCategoria = await pool.query(
            "INSERT INTO categoria_insumo (cat_ins_nombre, cat_ins_descripcion) VALUES ($1, $2) RETURNING cat_ins_id AS cat_id, cat_ins_nombre AS cat_nombre, cat_ins_descripcion AS cat_descripcion",
            [cat_nombre, cat_descripcion]
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
        const { cat_nombre, cat_descripcion } = req.body;
        const actualizar = await pool.query(
            "UPDATE categoria_insumo SET cat_ins_nombre = $1, cat_ins_descripcion = $2 WHERE cat_ins_id = $3 RETURNING cat_ins_id AS cat_id, cat_ins_nombre AS cat_nombre, cat_ins_descripcion AS cat_descripcion",
            [cat_nombre, cat_descripcion, id]
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
        const eliminar = await pool.query("DELETE FROM categoria_insumo WHERE cat_ins_id = $1 RETURNING *", [id]);
        if (eliminar.rows.length === 0) return res.status(404).json({ mensaje: "Categoría no encontrada" });
        res.status(200).json({ mensaje: "Categoría eliminada con éxito" });
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