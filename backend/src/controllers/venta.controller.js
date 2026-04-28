const pool = require('../config/db');

// Obtener todas las ventas
const getVentas = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT v.*, c.cli_nombre, coop.coop_nombre
            FROM venta v
            LEFT JOIN clientes c ON v.ven_fk_cliente = c.cli_id
            LEFT JOIN cooperativa coop ON v.ven_fk_cooperativa = coop.coop_id
            ORDER BY v.ven_fecha DESC, v.ven_id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener una venta por ID
const getVentaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM venta WHERE ven_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Venta no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear una venta
const createVenta = async (req, res) => {
    try {
        const {
            ven_fecha,
            ven_total,
            ven_tipo_pago,
            ven_fk_cliente,
            ven_fk_cooperativa
        } = req.body;

        const result = await pool.query(
            `INSERT INTO venta 
            (ven_fecha, ven_total, ven_tipo_pago, ven_fk_cliente, ven_fk_cooperativa) 
            VALUES (COALESCE($1, CURRENT_TIMESTAMP), COALESCE($2, 0), $3, $4, $5) RETURNING *`,
            [ven_fecha || null, ven_total || 0, ven_tipo_pago, ven_fk_cliente, ven_fk_cooperativa]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar una venta
const updateVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            ven_fecha,
            ven_total,
            ven_tipo_pago,
            ven_fk_cliente,
            ven_fk_cooperativa
        } = req.body;

        const result = await pool.query(
            `UPDATE venta 
            SET ven_fecha = $1, ven_total = $2, ven_tipo_pago = $3, ven_fk_cliente = $4, ven_fk_cooperativa = $5 
            WHERE ven_id = $6 RETURNING *`,
            [ven_fecha || null, ven_total || 0, ven_tipo_pago, ven_fk_cliente, ven_fk_cooperativa, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Venta no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar una venta
const deleteVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM venta WHERE ven_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Venta no encontrada' });
        res.json({ message: 'Venta eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar venta:', error);
        // Podría fallar si tiene detalles de venta, manejar el error de FK
        if (error.code === '23503') {
            return res.status(400).json({ error: 'No se puede eliminar la venta porque tiene detalles asociados.' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getVentas,
    getVentaById,
    createVenta,
    updateVenta,
    deleteVenta
};
