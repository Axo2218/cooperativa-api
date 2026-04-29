const pool = require('../config/db');

// OBTENER TODOS LOS VIAJES (Para tu Dashboard principal)
const obtenerViajes = async (req, res) => {
    try {
        const query = `
        SELECT 
            v.via_id, 
            v.via_estatus, 
            v.via_presupuesto_estimado,
            e.emb_nombre AS barco, 
            e.emb_capacidad_personal AS capacidad, -- <-- ¡EL CAMBIO TÁCTICO ESTÁ AQUÍ!
            p.per_nombre || ' ' || p.per_apellidos AS capitan
        FROM viaje v
        JOIN embarcacion e ON v.via_fk_embarcacion = e.emb_id
        JOIN personal p ON v.via_fk_capitan = p.per_id
        `;
        const respuesta = await pool.query(query);
        res.status(200).json(respuesta.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los viajes' });
    }
};

// CREAR UN NUEVO VIAJE (Zarpar)
const crearViaje = async (req, res) => {
    try {
        const { via_fk_embarcacion, via_fk_capitan, via_presupuesto_estimado, via_fk_zona } = req.body;
        const nuevoViaje = await pool.query(
            `INSERT INTO viaje 
            (via_fk_embarcacion, via_fk_capitan, via_presupuesto_estimado, via_fk_zona, via_estatus) 
            VALUES ($1, $2, $3, $4, 'En Preparación') RETURNING *`,
            [via_fk_embarcacion, via_fk_capitan, via_presupuesto_estimado, via_fk_zona]
        );
        res.status(201).json(nuevoViaje.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al planificar el viaje' });
    }
};

// ACTUALIZAR ESTATUS (El motor de tu "Stepper" tipo Mercado Libre)
const actualizarEstatusViaje = async (req, res) => {
    try {
        const { id } = req.params;
        const { via_estatus } = req.body; // 'En Preparación', 'En Curso', 'En Puerto', 'Finalizado'

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
        res.status(500).json({ error: 'Error crítico al intentar eliminar el viaje' });
    }
};

module.exports = {
    obtenerViajes,
    crearViaje,
    actualizarEstatusViaje,
    eliminarViaje // <-- ¡Esta es la pieza que faltaba!
};