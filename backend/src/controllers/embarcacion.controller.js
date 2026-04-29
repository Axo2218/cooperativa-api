const pool = require('../config/db');

// Obtener todas las embarcaciones
const getEmbarcaciones = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.*, coop.coop_nombre
            FROM embarcacion e
            LEFT JOIN cooperativa coop ON e.emb_fk_cooperativa = coop.coop_id
            ORDER BY e.emb_id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener embarcaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener una embarcacion por ID
const getEmbarcacionById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM embarcacion WHERE emb_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Embarcación no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la embarcación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear una embarcacion
const createEmbarcacion = async (req, res) => {
    try {
        const {
            emb_nombre,
            emb_matricula,
            emb_eslora,
            emb_manga,
            emb_capacidad_carga_kg,
            emb_tipo_motor,
            emb_estado,
            emb_fk_cooperativa
        } = req.body;

        const result = await pool.query(
            `INSERT INTO embarcacion 
            (emb_nombre, emb_matricula, emb_eslora, emb_manga, emb_capacidad_carga_kg, emb_tipo_motor, emb_estado, emb_fk_cooperativa) 
            VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'Activa'), $8) RETURNING *`,
            [emb_nombre, emb_matricula, emb_eslora || null, emb_manga || null, emb_capacidad_carga_kg || null, emb_tipo_motor, emb_estado, emb_fk_cooperativa]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear embarcación:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'La matrícula ya está registrada en otra embarcación' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar una embarcacion
const updateEmbarcacion = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            emb_nombre,
            emb_matricula,
            emb_eslora,
            emb_manga,
            emb_capacidad_carga_kg,
            emb_tipo_motor,
            emb_estado,
            emb_fk_cooperativa
        } = req.body;

        const result = await pool.query(
            `UPDATE embarcacion 
            SET emb_nombre = $1, 
                emb_matricula = $2, 
                emb_eslora = $3, 
                emb_manga = $4, 
                emb_capacidad_carga_kg = $5, 
                emb_tipo_motor = $6, 
                emb_estado = $7, 
                emb_fk_cooperativa = $8 
            WHERE emb_id = $9 RETURNING *`,
            [emb_nombre, emb_matricula, emb_eslora || null, emb_manga || null, emb_capacidad_carga_kg || null, emb_tipo_motor, emb_estado, emb_fk_cooperativa, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Embarcación no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar embarcación:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'La matrícula ya está registrada en otra embarcación' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar una embarcacion
const deleteEmbarcacion = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM embarcacion WHERE emb_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Embarcación no encontrada' });
        res.json({ message: 'Embarcación eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar embarcación:', error);
        if (error.code === '23503') {
            return res.status(400).json({ error: 'No se puede eliminar porque existen registros (alertas, bitácoras, pescas, etc.) vinculados a esta embarcación' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getEmbarcaciones,
    getEmbarcacionById,
    createEmbarcacion,
    updateEmbarcacion,
    deleteEmbarcacion
};
