const pool = require('../config/db');

// Obtener todas las alertas
const getAlertas = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.*, e.emb_nombre
            FROM alerta_sistema a
            LEFT JOIN embarcacion e ON a.ale_fk_embarcacion = e.emb_id
            ORDER BY a.ale_fecha_generacion DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener alertas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener una alerta por ID
const getAlertaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM alerta_sistema WHERE ale_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Alerta no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la alerta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear una alerta
const createAlerta = async (req, res) => {
    try {
        const {
            ale_fk_embarcacion,
            ale_tipo,
            ale_mensaje,
            ale_nivel_riesgo,
            ale_estatus
        } = req.body;

        const result = await pool.query(
            `INSERT INTO alerta_sistema 
            (ale_fk_embarcacion, ale_tipo, ale_mensaje, ale_nivel_riesgo, ale_estatus) 
            VALUES ($1, $2, $3, $4, COALESCE($5, 'No leída')) RETURNING *`,
            [ale_fk_embarcacion, ale_tipo, ale_mensaje, ale_nivel_riesgo, ale_estatus]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear alerta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar una alerta
const updateAlerta = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            ale_fk_embarcacion,
            ale_tipo,
            ale_mensaje,
            ale_nivel_riesgo,
            ale_estatus
        } = req.body;

        const result = await pool.query(
            `UPDATE alerta_sistema 
            SET ale_fk_embarcacion = $1, 
                ale_tipo = $2, 
                ale_mensaje = $3, 
                ale_nivel_riesgo = $4, 
                ale_estatus = $5 
            WHERE ale_id = $6 RETURNING *`,
            [ale_fk_embarcacion, ale_tipo, ale_mensaje, ale_nivel_riesgo, ale_estatus, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Alerta no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar alerta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar una alerta
const deleteAlerta = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM alerta_sistema WHERE ale_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Alerta no encontrada' });
        res.json({ message: 'Alerta eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar alerta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getAlertas,
    getAlertaById,
    createAlerta,
    updateAlerta,
    deleteAlerta
};
