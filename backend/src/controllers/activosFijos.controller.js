const pool = require('../config/db');

// Obtener todos los activos fijos
const getActivosFijos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.*, 
                   t.tip_act_nombre, 
                   c.coop_nombre, 
                   i.inst_nombre, 
                   e.emb_nombre
            FROM activos_fijos a
            LEFT JOIN cat_tipo_activo t ON a.act_fk_tipo = t.tip_act_id
            LEFT JOIN cooperativa c ON a.act_fk_cooperativa = c.coop_id
            LEFT JOIN instalacion i ON a.act_fk_instalacion = i.inst_id
            LEFT JOIN embarcacion e ON a.act_fk_embarcacion = e.emb_id
            ORDER BY a.act_id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener activos fijos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un activo fijo por ID
const getActivoFijoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM activos_fijos WHERE act_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Activo fijo no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el activo fijo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un activo fijo
const createActivoFijo = async (req, res) => {
    try {
        const {
            act_nombre,
            act_num_serie_o_placa,
            act_estado,
            act_fk_tipo,
            act_fk_cooperativa,
            act_fk_instalacion,
            act_fk_embarcacion
        } = req.body;

        const result = await pool.query(
            `INSERT INTO activos_fijos 
            (act_nombre, act_num_serie_o_placa, act_estado, act_fk_tipo, act_fk_cooperativa, act_fk_instalacion, act_fk_embarcacion) 
            VALUES ($1, $2, COALESCE($3, 'Operativo'), $4, $5, $6, $7) RETURNING *`,
            [act_nombre, act_num_serie_o_placa, act_estado, act_fk_tipo, act_fk_cooperativa, act_fk_instalacion, act_fk_embarcacion]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear activo fijo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un activo fijo
const updateActivoFijo = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            act_nombre,
            act_num_serie_o_placa,
            act_estado,
            act_fk_tipo,
            act_fk_cooperativa,
            act_fk_instalacion,
            act_fk_embarcacion
        } = req.body;

        const result = await pool.query(
            `UPDATE activos_fijos 
            SET act_nombre = $1, 
                act_num_serie_o_placa = $2, 
                act_estado = $3, 
                act_fk_tipo = $4, 
                act_fk_cooperativa = $5, 
                act_fk_instalacion = $6, 
                act_fk_embarcacion = $7 
            WHERE act_id = $8 RETURNING *`,
            [act_nombre, act_num_serie_o_placa, act_estado, act_fk_tipo, act_fk_cooperativa, act_fk_instalacion, act_fk_embarcacion, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Activo fijo no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar activo fijo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un activo fijo
const deleteActivoFijo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM activos_fijos WHERE act_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Activo fijo no encontrado' });
        res.json({ message: 'Activo fijo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar activo fijo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getActivosFijos,
    getActivoFijoById,
    createActivoFijo,
    updateActivoFijo,
    deleteActivoFijo
};
