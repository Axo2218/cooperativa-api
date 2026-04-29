const pool = require('../config/db');

// Obtener todos los pagos de nómina
const getPagosNomina = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, s.soc_nombre, s.soc_rfc
            FROM pagos_nomina p
            LEFT JOIN socios s ON p.pag_fk_socio = s.soc_id
            ORDER BY p.pag_fecha DESC, p.pag_id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener pagos de nómina:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un pago por ID
const getPagoNominaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM pagos_nomina WHERE pag_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Pago de nómina no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el pago de nómina:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un pago de nómina
const createPagoNomina = async (req, res) => {
    try {
        const {
            pag_fk_socio,
            pag_fecha,
            pag_monto_bruto,
            pag_deducciones,
            pag_referencia
        } = req.body;

        // pag_monto_neto es GENERATED ALWAYS AS (bruto - deducciones), la DB lo calcula.
        const result = await pool.query(
            `INSERT INTO pagos_nomina 
            (pag_fk_socio, pag_fecha, pag_monto_bruto, pag_deducciones, pag_referencia) 
            VALUES ($1, COALESCE($2, CURRENT_DATE), $3, COALESCE($4, 0), $5) RETURNING *`,
            [pag_fk_socio, pag_fecha || null, pag_monto_bruto, pag_deducciones || 0, pag_referencia]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear pago de nómina:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un pago de nómina
const updatePagoNomina = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            pag_fk_socio,
            pag_fecha,
            pag_monto_bruto,
            pag_deducciones,
            pag_referencia
        } = req.body;

        const result = await pool.query(
            `UPDATE pagos_nomina 
            SET pag_fk_socio = $1, 
                pag_fecha = $2, 
                pag_monto_bruto = $3, 
                pag_deducciones = $4, 
                pag_referencia = $5 
            WHERE pag_id = $6 RETURNING *`,
            [pag_fk_socio, pag_fecha || null, pag_monto_bruto, pag_deducciones || 0, pag_referencia, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Pago de nómina no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar pago de nómina:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un pago de nómina
const deletePagoNomina = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM pagos_nomina WHERE pag_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Pago de nómina no encontrado' });
        res.json({ message: 'Pago de nómina eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar pago de nómina:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getPagosNomina,
    getPagoNominaById,
    createPagoNomina,
    updatePagoNomina,
    deletePagoNomina
};
