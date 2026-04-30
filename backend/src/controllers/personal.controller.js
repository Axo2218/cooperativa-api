const pool = require('../config/db');

// Obtener todo el personal
const getPersonal = async (req, res) => {
    try {
        const { cooperativa } = req.query;
        let query = `
            SELECT p.*, r.rol_nombre, c.coop_nombre
            FROM personal p
            LEFT JOIN rol r ON p.per_fk_rol = r.rol_id
            LEFT JOIN cooperativa c ON p.per_fk_cooperativa = c.coop_id
        `;
        let params = [];

        if (cooperativa) {
            query += ` WHERE p.per_fk_cooperativa = $1 `;
            params.push(cooperativa);
        }

        query += ` ORDER BY p.per_id DESC `;
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener personal:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener personal por ID
const getPersonalById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM personal WHERE per_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Personal no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener personal:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear personal
const createPersonal = async (req, res) => {
    try {
        const {
            per_auth_uuid, per_nombre, per_apellidos, per_curp, per_telefono,
            per_contacto_emergencia, per_estatus, per_fk_rol, per_fk_cooperativa,
            per_nss, per_es_socio, per_numero_socio, per_certificado_aportacion
        } = req.body;

        const result = await pool.query(
            `INSERT INTO personal 
            (per_auth_uuid, per_nombre, per_apellidos, per_curp, per_telefono, per_contacto_emergencia, per_estatus, per_fk_rol, per_fk_cooperativa, per_nss, per_es_socio, per_numero_socio, per_certificado_aportacion) 
            VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, true), $8, $9, $10, COALESCE($11, false), $12, $13) RETURNING *`,
            [
                per_auth_uuid || null, per_nombre, per_apellidos, per_curp || null, per_telefono || null,
                per_contacto_emergencia || null, per_estatus, per_fk_rol, per_fk_cooperativa,
                per_nss || null, per_es_socio, per_numero_socio || null, per_certificado_aportacion || null
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear personal:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar personal
const updatePersonal = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            per_auth_uuid, per_nombre, per_apellidos, per_curp, per_telefono,
            per_contacto_emergencia, per_estatus, per_fk_rol, per_fk_cooperativa,
            per_nss, per_es_socio, per_numero_socio, per_certificado_aportacion
        } = req.body;

        const result = await pool.query(
            `UPDATE personal 
            SET per_auth_uuid = $1, per_nombre = $2, per_apellidos = $3, per_curp = $4, per_telefono = $5, 
                per_contacto_emergencia = $6, per_estatus = $7, per_fk_rol = $8, per_fk_cooperativa = $9, 
                per_nss = $10, per_es_socio = $11, per_numero_socio = $12, per_certificado_aportacion = $13 
            WHERE per_id = $14 RETURNING *`,
            [
                per_auth_uuid || null, per_nombre, per_apellidos, per_curp || null, per_telefono || null,
                per_contacto_emergencia || null, per_estatus, per_fk_rol, per_fk_cooperativa,
                per_nss || null, per_es_socio, per_numero_socio || null, per_certificado_aportacion || null, 
                id
            ]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Personal no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar personal:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar personal
const deletePersonal = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM personal WHERE per_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Personal no encontrado' });
        res.json({ message: 'Personal eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar personal:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener detalles completos de una persona (Historial de viajes y pagos)
const getPersonalDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Obtener datos básicos con rol y cooperativa
        const personalBase = await pool.query(`
            SELECT p.*, r.rol_nombre, c.coop_nombre
            FROM personal p
            LEFT JOIN rol r ON p.per_fk_rol = r.rol_id
            LEFT JOIN cooperativa c ON p.per_fk_cooperativa = c.coop_id
            WHERE p.per_id = $1
        `, [id]);

        if (personalBase.rows.length === 0) return res.status(404).json({ error: 'Personal no encontrado' });

        // 2. Obtener historial de viajes (viaje_personal -> viaje)
        const historialViajes = await pool.query(`
            SELECT 
                v.via_id, 
                v.via_fecha_salida, 
                v.via_fecha_llegada, 
                v.via_estatus,
                r.rol_nombre as rol_en_viaje,
                pt.pag_monto_recibido
            FROM viaje_personal vp
            JOIN viaje v ON vp.via_per_fk_viaje = v.via_id
            JOIN rol r ON vp.via_per_fk_rol = r.rol_id
            LEFT JOIN pago_tripulacion pt ON pt.pag_fk_personal = vp.via_per_fk_personal 
                AND pt.pag_fk_liquidacion IN (SELECT liq_id FROM liquidacion_viaje WHERE liq_fk_viaje = v.via_id)
            WHERE vp.via_per_fk_personal = $1
            ORDER BY v.via_fecha_salida DESC
        `, [id]);

        // 3. Obtener resumen de ingresos
        const resumenIngresos = await pool.query(`
            SELECT SUM(pag_monto_recibido) as total_acumulado, COUNT(pag_id) as viajes_pagados
            FROM pago_tripulacion
            WHERE pag_fk_personal = $1
        `, [id]);

        res.json({
            personal: personalBase.rows[0],
            viajes: historialViajes.rows,
            estadisticas: resumenIngresos.rows[0]
        });

    } catch (error) {
        console.error('Error al obtener detalles del personal:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getPersonal,
    getPersonalById,
    createPersonal,
    updatePersonal,
    deletePersonal,
    getPersonalDetails
};
