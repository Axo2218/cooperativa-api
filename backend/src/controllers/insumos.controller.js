const pool = require('../config/db');

// Obtener todos los insumos
const getInsumos = async (req, res) => {
    try {
        const { inst_id } = req.query;
        let query;
        let params = [];

        if (inst_id) {
            query = `
                SELECT i.ins_id, i.ins_nombre, c.cat_ins_nombre as ins_categoria, u.uni_nombre as ins_unidad_medida, i.ins_costo_unitario_referencia, i.ins_estatus, i.ins_fk_categoria, i.ins_fk_unidad,
                       COALESCE(inv.inv_cantidad_actual, 0) AS ins_stock_actual,
                       0 AS ins_stock_minimo
                FROM insumo i
                LEFT JOIN categoria_insumo c ON i.ins_fk_categoria = c.cat_ins_id
                LEFT JOIN unidad_medida u ON i.ins_fk_unidad = u.uni_id
                LEFT JOIN inventario_insumos inv ON i.ins_id = inv.inv_fk_insumo AND inv.inv_fk_instalacion = $1
                ORDER BY i.ins_id ASC
            `;
            params = [inst_id];
        } else {
            query = `
                SELECT i.ins_id, i.ins_nombre, c.cat_ins_nombre as ins_categoria, u.uni_nombre as ins_unidad_medida, i.ins_costo_unitario_referencia, i.ins_estatus, i.ins_fk_categoria, i.ins_fk_unidad,
                       SUM(COALESCE(inv.inv_cantidad_actual, 0)) AS ins_stock_actual,
                       0 AS ins_stock_minimo
                FROM insumo i
                LEFT JOIN categoria_insumo c ON i.ins_fk_categoria = c.cat_ins_id
                LEFT JOIN unidad_medida u ON i.ins_fk_unidad = u.uni_id
                LEFT JOIN inventario_insumos inv ON i.ins_id = inv.inv_fk_insumo
                GROUP BY i.ins_id, i.ins_nombre, c.cat_ins_nombre, u.uni_nombre, i.ins_costo_unitario_referencia, i.ins_estatus, i.ins_fk_categoria, i.ins_fk_unidad
                ORDER BY i.ins_id ASC
            `;
        }

        const result = await pool.query(query, params);
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
        const result = await pool.query(`
            SELECT i.ins_id, i.ins_nombre, c.cat_ins_nombre as ins_categoria, u.uni_nombre as ins_unidad_medida, i.ins_costo_unitario_referencia, i.ins_estatus, i.ins_fk_categoria, i.ins_fk_unidad,
                   SUM(COALESCE(inv.inv_cantidad_actual, 0)) AS ins_stock_actual,
                   0 AS ins_stock_minimo
            FROM insumo i
            LEFT JOIN categoria_insumo c ON i.ins_fk_categoria = c.cat_ins_id
            LEFT JOIN unidad_medida u ON i.ins_fk_unidad = u.uni_id
            LEFT JOIN inventario_insumos inv ON i.ins_id = inv.inv_fk_insumo
            WHERE i.ins_id = $1
            GROUP BY i.ins_id, i.ins_nombre, c.cat_ins_nombre, u.uni_nombre, i.ins_costo_unitario_referencia, i.ins_estatus, i.ins_fk_categoria, i.ins_fk_unidad
        `, [id]);
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
            ins_fk_categoria,
            ins_fk_unidad,
            ins_costo_unitario_referencia
        } = req.body;

        const result = await pool.query(
            `INSERT INTO insumo 
            (ins_nombre, ins_fk_categoria, ins_fk_unidad, ins_costo_unitario_referencia) 
            VALUES ($1, $2, $3, COALESCE($4, 0)) RETURNING *`,
            [ins_nombre, ins_fk_categoria, ins_fk_unidad, ins_costo_unitario_referencia || 0]
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
            ins_fk_categoria,
            ins_fk_unidad,
            ins_costo_unitario_referencia
        } = req.body;

        const result = await pool.query(
            `UPDATE insumo 
            SET ins_nombre = $1, 
                ins_fk_categoria = $2, 
                ins_fk_unidad = $3, 
                ins_costo_unitario_referencia = $4
            WHERE ins_id = $5 RETURNING *`,
            [ins_nombre, ins_fk_categoria, ins_fk_unidad, ins_costo_unitario_referencia || 0, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Insumo no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar insumo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Ajustar stock de un insumo en una instalación específica
const ajustarStock = async (req, res) => {
    try {
        const { ins_id } = req.params;
        const { inst_id, cantidad } = req.body;

        if (!inst_id || cantidad === undefined) {
            return res.status(400).json({ error: 'Se requiere instalación y cantidad' });
        }

        const result = await pool.query(
            `INSERT INTO inventario_insumos (inv_fk_insumo, inv_fk_instalacion, inv_cantidad_actual)
             VALUES ($1, $2, $3)
             ON CONFLICT ON CONSTRAINT unq_ubicacion_insumo
             DO UPDATE SET inv_cantidad_actual = $3, inv_ultima_actualizacion = CURRENT_TIMESTAMP
             RETURNING *`,
            [ins_id, inst_id, cantidad]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al ajustar stock:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un insumo
const deleteInsumo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM insumo WHERE ins_id = $1 RETURNING *', [id]);
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
    deleteInsumo,
    ajustarStock
};
