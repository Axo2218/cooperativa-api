const pool = require('../config/db');

// Obtener todas las compras de insumos
const getComprasInsumos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, p.prov_nombre, coop.coop_nombre
            FROM compras_insumos c
            LEFT JOIN proveedores p ON c.comp_fk_proveedor = p.prov_id
            LEFT JOIN cooperativa coop ON c.comp_fk_cooperativa = coop.coop_id
            ORDER BY c.comp_fecha DESC, c.comp_id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener compras de insumos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener una compra por ID
const getCompraInsumoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM compras_insumos WHERE comp_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Compra no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la compra de insumos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear una compra
const createCompraInsumo = async (req, res) => {
    try {
        const {
            comp_fk_proveedor,
            comp_fecha,
            comp_factura,
            comp_total,
            comp_fk_cooperativa,
            comp_estado
        } = req.body;

        const result = await pool.query(
            `INSERT INTO compras_insumos 
            (comp_fk_proveedor, comp_fecha, comp_factura, comp_total, comp_fk_cooperativa, comp_estado) 
            VALUES ($1, COALESCE($2, CURRENT_DATE), $3, $4, $5, COALESCE($6, 'Completada')) RETURNING *`,
            [comp_fk_proveedor, comp_fecha, comp_factura, comp_total, comp_fk_cooperativa, comp_estado]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear compra de insumos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar una compra
const updateCompraInsumo = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            comp_fk_proveedor,
            comp_fecha,
            comp_factura,
            comp_total,
            comp_fk_cooperativa,
            comp_estado
        } = req.body;

        const result = await pool.query(
            `UPDATE compras_insumos 
            SET comp_fk_proveedor = $1, 
                comp_fecha = $2, 
                comp_factura = $3, 
                comp_total = $4, 
                comp_fk_cooperativa = $5, 
                comp_estado = $6 
            WHERE comp_id = $7 RETURNING *`,
            [comp_fk_proveedor, comp_fecha, comp_factura, comp_total, comp_fk_cooperativa, comp_estado, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Compra no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar compra de insumos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar una compra
const deleteCompraInsumo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM compras_insumos WHERE comp_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Compra no encontrada' });
        res.json({ message: 'Compra eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar compra de insumos:', error);
        if (error.code === '23503') {
            return res.status(400).json({ error: 'No se puede eliminar porque esta compra tiene detalles de insumos asociados' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getComprasInsumos,
    getCompraInsumoById,
    createCompraInsumo,
    updateCompraInsumo,
    deleteCompraInsumo
};
