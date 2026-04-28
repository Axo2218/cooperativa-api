const pool = require('../config/db');

// OBTENER TODOS LOS VIAJES (Full data para Dashboard y CRUD)
const obtenerViajes = async (req, res) => {
    try {
        const query = `
        SELECT 
            v.*, 
            e.emb_nombre AS barco, 
            e.emb_capacidad_personal AS capacidad, 
            e.emb_matricula,
            p.per_nombre || ' ' || p.per_apellidos AS capitan,
            z.zona_nombre
        FROM viaje v
        LEFT JOIN embarcacion e ON v.via_fk_embarcacion = e.emb_id
        LEFT JOIN personal p ON v.via_fk_capitan = p.per_id
        LEFT JOIN zona_pesca z ON v.via_fk_zona = z.zona_id
        ORDER BY v.via_id DESC
        `;
        const respuesta = await pool.query(query);
        res.status(200).json(respuesta.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los viajes' });
    }
};

// Obtener un viaje por ID
const getViajeById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT 
                v.*, 
                e.emb_nombre AS barco, 
                p.per_nombre || ' ' || p.per_apellidos AS capitan,
                z.zona_nombre
            FROM viaje v
            LEFT JOIN embarcacion e ON v.via_fk_embarcacion = e.emb_id
            LEFT JOIN personal p ON v.via_fk_capitan = p.per_id
            LEFT JOIN zona_pesca z ON v.via_fk_zona = z.zona_id
            WHERE via_id = $1
        `, [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Viaje no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// CREAR UN NUEVO VIAJE (Zarpar o planificar)
const crearViaje = async (req, res) => {
    try {
        const { 
            via_fecha_salida, 
            via_fecha_llegada, 
            via_estatus, 
            via_observaciones, 
            via_fk_embarcacion, 
            via_fk_capitan, 
            via_fecha_estimada, 
            via_presupuesto_estimado, 
            via_fk_zona 
        } = req.body;

        const nuevoViaje = await pool.query(
            `INSERT INTO viaje 
            (via_fecha_salida, via_fecha_llegada, via_estatus, via_observaciones, via_fk_embarcacion, via_fk_capitan, via_fecha_estimada, via_presupuesto_estimado, via_fk_zona) 
            VALUES (COALESCE($1, CURRENT_TIMESTAMP), $2, COALESCE($3, 'Pendiente'), $4, $5, $6, $7, COALESCE($8, 0), $9) RETURNING *`,
            [via_fecha_salida || null, via_fecha_llegada || null, via_estatus || 'Pendiente', via_observaciones || null, via_fk_embarcacion, via_fk_capitan, via_fecha_estimada || null, via_presupuesto_estimado || 0, via_fk_zona || null]
        );
        res.status(201).json(nuevoViaje.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al planificar el viaje' });
    }
};

// ACTUALIZAR VIAJE COMPLETO (Para el CRUD principal)
const updateViaje = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            via_fecha_salida, 
            via_fecha_llegada, 
            via_estatus, 
            via_observaciones, 
            via_fk_embarcacion, 
            via_fk_capitan, 
            via_fecha_estimada, 
            via_presupuesto_estimado, 
            via_fk_zona 
        } = req.body;

        const result = await pool.query(
            `UPDATE viaje 
            SET via_fecha_salida = $1, via_fecha_llegada = $2, via_estatus = $3, via_observaciones = $4, 
                via_fk_embarcacion = $5, via_fk_capitan = $6, via_fecha_estimada = $7, via_presupuesto_estimado = $8, via_fk_zona = $9 
            WHERE via_id = $10 RETURNING *`,
            [via_fecha_salida || null, via_fecha_llegada || null, via_estatus || 'Pendiente', via_observaciones || null, via_fk_embarcacion, via_fk_capitan, via_fecha_estimada || null, via_presupuesto_estimado || 0, via_fk_zona || null, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Viaje no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// ACTUALIZAR ESTATUS (El motor de tu "Stepper" tipo Mercado Libre)
const actualizarEstatusViaje = async (req, res) => {
    try {
        const { id } = req.params;
        const { via_estatus } = req.body; 

        const actualizar = await pool.query(
            "UPDATE viaje SET via_estatus = $1 WHERE via_id = $2 RETURNING *",
            [via_estatus, id]
        );

        if (actualizar.rows.length === 0) return res.status(404).json({ mensaje: "Viaje no encontrado" });
        res.status(200).json({ mensaje: `Estatus actualizado a: ${via_estatus}`, viaje: actualizar.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cambiar de estatus' });
    }
};

// ELIMINAR UN VIAJE (Torpedo listo)
const eliminarViaje = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminar = await pool.query("DELETE FROM viaje WHERE via_id = $1 RETURNING *", [id]);

        if (eliminar.rows.length === 0) return res.status(404).json({ mensaje: "Viaje no encontrado en el radar" });
        res.status(200).json({ mensaje: "Viaje eliminado con éxito" });
    } catch (error) {
        console.error(error);
        if (error.code === '23503') return res.status(400).json({ error: 'No se puede eliminar el viaje porque tiene gastos o detalles de captura asociados.' });
        res.status(500).json({ error: 'Error crítico al intentar eliminar el viaje' });
    }
};

module.exports = {
    obtenerViajes,
    getViajeById,
    crearViaje,
    updateViaje,
    actualizarEstatusViaje,
    eliminarViaje
};