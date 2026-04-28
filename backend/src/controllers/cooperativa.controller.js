const pool = require('../config/db');

// Obtener todas las cooperativas
const getCooperativas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cooperativa ORDER BY coop_id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener cooperativas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener una cooperativa por ID
const getCooperativaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM cooperativa WHERE coop_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Cooperativa no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la cooperativa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear una cooperativa
const createCooperativa = async (req, res) => {
    try {
        const {
            coop_nombre,
            coop_rfc,
            coop_fecha_constitucion,
            coop_direccion_oficina,
            coop_telefono,
            coop_correo
        } = req.body;

        const result = await pool.query(
            `INSERT INTO cooperativa 
            (coop_nombre, coop_rfc, coop_fecha_constitucion, coop_direccion_oficina, coop_telefono, coop_correo) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [coop_nombre, coop_rfc, coop_fecha_constitucion || null, coop_direccion_oficina, coop_telefono, coop_correo]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear cooperativa:', error);
        if (error.code === '23505') { // Unique constraint
            return res.status(400).json({ error: 'El RFC ya está registrado para otra cooperativa' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar una cooperativa
const updateCooperativa = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            coop_nombre,
            coop_rfc,
            coop_fecha_constitucion,
            coop_direccion_oficina,
            coop_telefono,
            coop_correo
        } = req.body;

        const result = await pool.query(
            `UPDATE cooperativa 
            SET coop_nombre = $1, 
                coop_rfc = $2, 
                coop_fecha_constitucion = $3, 
                coop_direccion_oficina = $4, 
                coop_telefono = $5, 
                coop_correo = $6 
            WHERE coop_id = $7 RETURNING *`,
            [coop_nombre, coop_rfc, coop_fecha_constitucion || null, coop_direccion_oficina, coop_telefono, coop_correo, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Cooperativa no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar cooperativa:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El RFC ya está registrado para otra cooperativa' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar una cooperativa
const deleteCooperativa = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM cooperativa WHERE coop_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Cooperativa no encontrada' });
        res.json({ message: 'Cooperativa eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar cooperativa:', error);
        if (error.code === '23503') { // Foreign key constraint
            return res.status(400).json({ error: 'No se puede eliminar porque existen registros (socios, activos, etc.) vinculados a esta cooperativa' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getCooperativas,
    getCooperativaById,
    createCooperativa,
    updateCooperativa,
    deleteCooperativa
};
