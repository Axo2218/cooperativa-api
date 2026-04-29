const pool = require('../config/db');

// Obtener todos los registros de la bitácora
const getBitacoras = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT b.*, 
                   e.emb_nombre, 
                   a.act_nombre
            FROM bitacora_mantenimiento b
            LEFT JOIN embarcacion e ON b.mant_fk_embarcacion = e.emb_id
            LEFT JOIN activos_fijos a ON b.mant_fk_activo = a.act_id
            ORDER BY b.mant_fecha DESC, b.mant_id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener bitácoras:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un registro por ID
const getBitacoraById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM bitacora_mantenimiento WHERE mant_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro de bitácora no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el registro de bitácora:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un registro en la bitácora
const createBitacora = async (req, res) => {
    try {
        const {
            mant_fk_embarcacion,
            mant_fk_activo,
            mant_fecha,
            mant_tipo,
            mant_descripcion,
            mant_costo_total,
            mant_taller_proveedor
        } = req.body;

        const result = await pool.query(
            `INSERT INTO bitacora_mantenimiento 
            (mant_fk_embarcacion, mant_fk_activo, mant_fecha, mant_tipo, mant_descripcion, mant_costo_total, mant_taller_proveedor) 
            VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4, $5, COALESCE($6, 0), $7) RETURNING *`,
            [mant_fk_embarcacion, mant_fk_activo || null, mant_fecha, mant_tipo, mant_descripcion, mant_costo_total, mant_taller_proveedor]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear registro en bitácora:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un registro de la bitácora
const updateBitacora = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            mant_fk_embarcacion,
            mant_fk_activo,
            mant_fecha,
            mant_tipo,
            mant_descripcion,
            mant_costo_total,
            mant_taller_proveedor
        } = req.body;

        const result = await pool.query(
            `UPDATE bitacora_mantenimiento 
            SET mant_fk_embarcacion = $1, 
                mant_fk_activo = $2, 
                mant_fecha = $3, 
                mant_tipo = $4, 
                mant_descripcion = $5, 
                mant_costo_total = $6, 
                mant_taller_proveedor = $7 
            WHERE mant_id = $8 RETURNING *`,
            [mant_fk_embarcacion, mant_fk_activo || null, mant_fecha, mant_tipo, mant_descripcion, mant_costo_total, mant_taller_proveedor, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro de bitácora no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar registro de bitácora:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un registro de la bitácora
const deleteBitacora = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM bitacora_mantenimiento WHERE mant_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro de bitácora no encontrado' });
        res.json({ message: 'Registro de bitácora eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar registro de bitácora:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getBitacoras,
    getBitacoraById,
    createBitacora,
    updateBitacora,
    deleteBitacora
};
