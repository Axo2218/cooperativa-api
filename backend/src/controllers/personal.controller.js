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

module.exports = {
    getPersonal,
    getPersonalById,
    createPersonal,
    updatePersonal,
    deletePersonal
};
