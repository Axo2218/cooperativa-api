const pool = require('../config/db');

// Obtener todas las facturas
const getFacturas = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT f.*, v.vent_folio as venta_folio
            FROM facturacion f
            LEFT JOIN ventas v ON f.fac_fk_venta = v.vent_id
            ORDER BY f.fac_fecha_emision DESC, f.fac_id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener facturas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener una factura por ID
const getFacturaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM facturacion WHERE fac_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Factura no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la factura:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear una factura
const createFactura = async (req, res) => {
    try {
        const {
            fac_folio,
            fac_fk_venta,
            fac_fecha_emision,
            fac_total,
            fac_rfc_receptor,
            fac_estado
        } = req.body;

        const result = await pool.query(
            `INSERT INTO facturacion 
            (fac_folio, fac_fk_venta, fac_fecha_emision, fac_total, fac_rfc_receptor, fac_estado) 
            VALUES ($1, $2, COALESCE($3, CURRENT_TIMESTAMP), $4, $5, COALESCE($6, 'Emitida')) RETURNING *`,
            [fac_folio, fac_fk_venta, fac_fecha_emision || null, fac_total, fac_rfc_receptor, fac_estado]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear factura:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El folio de factura ya está registrado' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar una factura
const updateFactura = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            fac_folio,
            fac_fk_venta,
            fac_fecha_emision,
            fac_total,
            fac_rfc_receptor,
            fac_estado
        } = req.body;

        const result = await pool.query(
            `UPDATE facturacion 
            SET fac_folio = $1, 
                fac_fk_venta = $2, 
                fac_fecha_emision = $3, 
                fac_total = $4, 
                fac_rfc_receptor = $5, 
                fac_estado = $6 
            WHERE fac_id = $7 RETURNING *`,
            [fac_folio, fac_fk_venta, fac_fecha_emision || null, fac_total, fac_rfc_receptor, fac_estado, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Factura no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar factura:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El folio de factura ya está registrado' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar una factura
const deleteFactura = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM facturacion WHERE fac_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Factura no encontrada' });
        res.json({ message: 'Factura eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar factura:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getFacturas,
    getFacturaById,
    createFactura,
    updateFactura,
    deleteFactura
};
