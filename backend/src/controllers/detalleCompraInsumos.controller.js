const pool = require('../config/db');

// Obtener todos los detalles de compras
const getDetallesCompra = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT d.*, c.comp_factura, c.comp_fecha, i.ins_nombre
            FROM detalle_compra_insumos d
            LEFT JOIN compras_insumos c ON d.dcomp_fk_compra = c.comp_id
            LEFT JOIN insumos i ON d.dcomp_fk_insumo = i.ins_id
            ORDER BY d.dcomp_id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener detalles de compra:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un detalle por ID
const getDetalleCompraById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM detalle_compra_insumos WHERE dcomp_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Detalle de compra no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el detalle de compra:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener detalles por ID de compra (Para filtrar en la vista principal si se requiere)
const getDetallesByCompraId = async (req, res) => {
    try {
        const { compraId } = req.params;
        const result = await pool.query(`
            SELECT d.*, i.ins_nombre
            FROM detalle_compra_insumos d
            LEFT JOIN insumos i ON d.dcomp_fk_insumo = i.ins_id
            WHERE d.dcomp_fk_compra = $1
            ORDER BY d.dcomp_id ASC
        `, [compraId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los detalles de la compra:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un detalle de compra
const createDetalleCompra = async (req, res) => {
    try {
        const {
            dcomp_fk_compra,
            dcomp_fk_insumo,
            dcomp_cantidad,
            dcomp_precio_unitario
        } = req.body;

        // dcomp_subtotal es GENERATED ALWAYS AS (cantidad * precio) STORED, no se inserta manualmente.
        const result = await pool.query(
            `INSERT INTO detalle_compra_insumos 
            (dcomp_fk_compra, dcomp_fk_insumo, dcomp_cantidad, dcomp_precio_unitario) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [dcomp_fk_compra, dcomp_fk_insumo, dcomp_cantidad, dcomp_precio_unitario]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear detalle de compra:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un detalle de compra
const updateDetalleCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            dcomp_fk_compra,
            dcomp_fk_insumo,
            dcomp_cantidad,
            dcomp_precio_unitario
        } = req.body;

        const result = await pool.query(
            `UPDATE detalle_compra_insumos 
            SET dcomp_fk_compra = $1, 
                dcomp_fk_insumo = $2, 
                dcomp_cantidad = $3, 
                dcomp_precio_unitario = $4 
            WHERE dcomp_id = $5 RETURNING *`,
            [dcomp_fk_compra, dcomp_fk_insumo, dcomp_cantidad, dcomp_precio_unitario, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Detalle de compra no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar detalle de compra:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un detalle de compra
const deleteDetalleCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM detalle_compra_insumos WHERE dcomp_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Detalle de compra no encontrado' });
        res.json({ message: 'Detalle de compra eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar detalle de compra:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getDetallesCompra,
    getDetalleCompraById,
    getDetallesByCompraId,
    createDetalleCompra,
    updateDetalleCompra,
    deleteDetalleCompra
};
