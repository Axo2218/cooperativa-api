const pool = require('../config/db');

// Obtener todos los mantenimientos
const getMantenimientos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                m.mant_id, 
                m.mant_fk_embarcacion, 
                m.mant_fecha_inicio, 
                m.mant_fecha_fin, 
                m.mant_descripcion, 
                m.mant_costo, 
                m.mant_estado,
                e.emb_nombre, 
                e.emb_matricula
            FROM mantenimiento_embarcacion m
            JOIN embarcacion e ON m.mant_fk_embarcacion = e.emb_id
            
            UNION ALL
            
            SELECT 
                NULL as mant_id, 
                e.emb_id as mant_fk_embarcacion, 
                CURRENT_DATE as mant_fecha_inicio, 
                NULL as mant_fecha_fin, 
                'En mantenimiento (Sin registro detallado)' as mant_descripcion, 
                0 as mant_costo, 
                'En Proceso' as mant_estado, 
                e.emb_nombre, 
                e.emb_matricula
            FROM embarcacion e
            WHERE e.emb_estatus = 'En Mantenimiento'
            AND e.emb_id NOT IN (
                SELECT mant_fk_embarcacion 
                FROM mantenimiento_embarcacion 
                WHERE mant_estado IN ('En Proceso', 'Pendiente')
            )
            
            ORDER BY mant_fecha_inicio DESC, mant_id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener mantenimientos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un mantenimiento por ID
const getMantenimientoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM mantenimiento_embarcacion WHERE mant_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Mantenimiento no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el mantenimiento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un mantenimiento
const createMantenimiento = async (req, res) => {
    try {
        const {
            mant_fk_embarcacion,
            mant_fecha_inicio,
            mant_fecha_fin,
            mant_descripcion,
            mant_costo,
            mant_estado
        } = req.body;

        const result = await pool.query(
            `INSERT INTO mantenimiento_embarcacion 
            (mant_fk_embarcacion, mant_fecha_inicio, mant_fecha_fin, mant_descripcion, mant_costo, mant_estado) 
            VALUES ($1, COALESCE($2, CURRENT_DATE), $3, $4, COALESCE($5, 0), COALESCE($6, 'En Proceso')) RETURNING *`,
            [mant_fk_embarcacion, mant_fecha_inicio || null, mant_fecha_fin || null, mant_descripcion, mant_costo || 0, mant_estado]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear mantenimiento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un mantenimiento
const updateMantenimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            mant_fk_embarcacion,
            mant_fecha_inicio,
            mant_fecha_fin,
            mant_descripcion,
            mant_costo,
            mant_estado
        } = req.body;

        const result = await pool.query(
            `UPDATE mantenimiento_embarcacion 
            SET mant_fk_embarcacion = $1, 
                mant_fecha_inicio = $2, 
                mant_fecha_fin = $3, 
                mant_descripcion = $4, 
                mant_costo = $5, 
                mant_estado = $6 
            WHERE mant_id = $7 RETURNING *`,
            [mant_fk_embarcacion, mant_fecha_inicio || null, mant_fecha_fin || null, mant_descripcion, mant_costo || 0, mant_estado, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Mantenimiento no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar mantenimiento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un mantenimiento
const deleteMantenimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM mantenimiento_embarcacion WHERE mant_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Mantenimiento no encontrado' });
        res.json({ message: 'Mantenimiento eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar mantenimiento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getMantenimientos,
    getMantenimientoById,
    createMantenimiento,
    updateMantenimiento,
    deleteMantenimiento
};
