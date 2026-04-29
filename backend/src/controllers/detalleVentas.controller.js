const pool = require('../config/db');

// Obtener todos los detalles de ventas
const getDetallesVentas = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                d.*, 
                v.ven_fecha, 
                e.esp_nombre_comun,
                (d.ven_det_kg * d.ven_det_precio_kg_venta) AS ven_det_subtotal
            FROM venta_detalle d
            LEFT JOIN venta v ON d.ven_det_fk_venta = v.ven_id
            LEFT JOIN especie e ON d.ven_det_fk_especie = e.esp_id
            ORDER BY d.ven_det_id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener detalles de ventas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un detalle por ID
const getDetalleVentaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT 
                d.*,
                (d.ven_det_kg * d.ven_det_precio_kg_venta) AS ven_det_subtotal
            FROM venta_detalle d 
            WHERE ven_det_id = $1
        `, [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Detalle de venta no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el detalle de venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener detalles por ID de venta
const getDetallesByVentaId = async (req, res) => {
    try {
        const { ventaId } = req.params;
        const result = await pool.query(`
            SELECT 
                d.*, 
                e.esp_nombre_comun,
                (d.ven_det_kg * d.ven_det_precio_kg_venta) AS ven_det_subtotal
            FROM venta_detalle d
            LEFT JOIN especie e ON d.ven_det_fk_especie = e.esp_id
            WHERE d.ven_det_fk_venta = $1
            ORDER BY d.ven_det_id ASC
        `, [ventaId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los detalles de la venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un detalle de venta
const createDetalleVenta = async (req, res) => {
    try {
        const {
            ven_det_fk_venta,
            ven_det_fk_especie,
            ven_det_kg,
            ven_det_precio_kg_venta
        } = req.body;

        const result = await pool.query(
            `INSERT INTO venta_detalle 
            (ven_det_fk_venta, ven_det_fk_especie, ven_det_kg, ven_det_precio_kg_venta) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [ven_det_fk_venta, ven_det_fk_especie, ven_det_kg, ven_det_precio_kg_venta]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear detalle de venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un detalle de venta
const updateDetalleVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            ven_det_fk_venta,
            ven_det_fk_especie,
            ven_det_kg,
            ven_det_precio_kg_venta
        } = req.body;

        const result = await pool.query(
            `UPDATE venta_detalle 
            SET ven_det_fk_venta = $1, 
                ven_det_fk_especie = $2, 
                ven_det_kg = $3, 
                ven_det_precio_kg_venta = $4 
            WHERE ven_det_id = $5 RETURNING *`,
            [ven_det_fk_venta, ven_det_fk_especie, ven_det_kg, ven_det_precio_kg_venta, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Detalle de venta no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar detalle de venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un detalle de venta
const deleteDetalleVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM venta_detalle WHERE ven_det_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Detalle de venta no encontrado' });
        res.json({ message: 'Detalle de venta eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar detalle de venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getDetallesVentas,
    getDetalleVentaById,
    getDetallesByVentaId,
    createDetalleVenta,
    updateDetalleVenta,
    deleteDetalleVenta
};
