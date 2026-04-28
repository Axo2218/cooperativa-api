const pool = require('../config/db');

// Obtener todas las cuotas
const getCuotas = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, s.soc_nombre, coop.coop_nombre
            FROM cuotas c
            LEFT JOIN socios s ON c.cuo_fk_socio = s.soc_id
            LEFT JOIN cooperativa coop ON c.cuo_fk_cooperativa = coop.coop_id
            ORDER BY c.cuo_fecha_pago DESC, c.cuo_id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener cuotas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener una cuota por ID
const getCuotaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM cuotas WHERE cuo_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Cuota no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la cuota:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear una cuota
const createCuota = async (req, res) => {
    try {
        const {
            cuo_fk_socio,
            cuo_monto,
            cuo_fecha_pago,
            cuo_tipo,
            cuo_estado,
            cuo_fk_cooperativa
        } = req.body;

        const result = await pool.query(
            `INSERT INTO cuotas 
            (cuo_fk_socio, cuo_monto, cuo_fecha_pago, cuo_tipo, cuo_estado, cuo_fk_cooperativa) 
            VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4, COALESCE($5, 'Pagada'), $6) RETURNING *`,
            [cuo_fk_socio, cuo_monto, cuo_fecha_pago, cuo_tipo, cuo_estado, cuo_fk_cooperativa]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear cuota:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar una cuota
const updateCuota = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            cuo_fk_socio,
            cuo_monto,
            cuo_fecha_pago,
            cuo_tipo,
            cuo_estado,
            cuo_fk_cooperativa
        } = req.body;

        const result = await pool.query(
            `UPDATE cuotas 
            SET cuo_fk_socio = $1, 
                cuo_monto = $2, 
                cuo_fecha_pago = $3, 
                cuo_tipo = $4, 
                cuo_estado = $5, 
                cuo_fk_cooperativa = $6 
            WHERE cuo_id = $7 RETURNING *`,
            [cuo_fk_socio, cuo_monto, cuo_fecha_pago, cuo_tipo, cuo_estado, cuo_fk_cooperativa, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Cuota no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar cuota:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar una cuota
const deleteCuota = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM cuotas WHERE cuo_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Cuota no encontrada' });
        res.json({ message: 'Cuota eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar cuota:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getCuotas,
    getCuotaById,
    createCuota,
    updateCuota,
    deleteCuota
};
