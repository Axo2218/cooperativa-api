const pool = require('../config/db');

// Obtener todos los insumos
const getInsumos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT i.*, c.cat_ins_nombre
            FROM insumos i
            LEFT JOIN categoria_insumo c ON i.ins_fk_categoria = c.cat_ins_id
            ORDER BY i.ins_id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener insumos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un insumo por ID
const getInsumoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM insumos WHERE ins_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Insumo no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el insumo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un insumo
const createInsumo = async (req, res) => {
    try {
        const {
            ins_nombre,
            ins_descripcion,
            ins_fk_categoria,
            ins_unidad_medida,
            ins_stock_actual,
            ins_stock_minimo
        } = req.body;

        const result = await pool.query(
            `INSERT INTO insumos 
            (ins_nombre, ins_descripcion, ins_fk_categoria, ins_unidad_medida, ins_stock_actual, ins_stock_minimo) 
            VALUES ($1, $2, $3, $4, COALESCE($5, 0), COALESCE($6, 0)) RETURNING *`,
            [ins_nombre, ins_descripcion, ins_fk_categoria, ins_unidad_medida, ins_stock_actual || 0, ins_stock_minimo || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear insumo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un insumo
const updateInsumo = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            ins_nombre,
            ins_descripcion,
            ins_fk_categoria,
            ins_unidad_medida,
            ins_stock_actual,
            ins_stock_minimo
        } = req.body;

        const result = await pool.query(
            `UPDATE insumos 
            SET ins_nombre = $1, 
                ins_descripcion = $2, 
                ins_fk_categoria = $3, 
                ins_unidad_medida = $4, 
                ins_stock_actual = $5, 
                ins_stock_minimo = $6 
            WHERE ins_id = $7 RETURNING *`,
            [ins_nombre, ins_descripcion, ins_fk_categoria, ins_unidad_medida, ins_stock_actual || 0, ins_stock_minimo || 0, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Insumo no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar insumo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un insumo
const deleteInsumo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM insumos WHERE ins_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Insumo no encontrado' });
        res.json({ message: 'Insumo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar insumo:', error);
        if (error.code === '23503') {
            return res.status(400).json({ error: 'No se puede eliminar este insumo porque está siendo utilizado en compras o vales' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getInsumos,
    getInsumoById,
    createInsumo,
    updateInsumo,
    deleteInsumo
};
