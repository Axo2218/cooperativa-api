const pool = require('../config/db');

// Obtener toda la tripulación registrada en los viajes
const getTripulacion = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                vp.*, 
                v.via_fecha_salida,
                v.via_estatus,
                p.per_nombre || ' ' || p.per_apellidos AS personal_nombre,
                r.rol_nombre,
                r.rol_puntos_reparto
            FROM viaje_personal vp
            LEFT JOIN viaje v ON vp.via_per_fk_viaje = v.via_id
            LEFT JOIN personal p ON vp.via_per_fk_personal = p.per_id
            LEFT JOIN rol r ON vp.via_per_fk_rol = r.rol_id
            WHERE vp.via_per_enrolado = TRUE
            ORDER BY vp.via_per_id DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener la tripulación de los viajes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un registro por ID
const getTripulanteById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM viaje_personal WHERE via_per_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro de tripulante no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el tripulante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener tripulación por ID de viaje (Crítico para calcular la liquidación de puntos)
const getTripulacionByViajeId = async (req, res) => {
    try {
        const { viajeId } = req.params;
        const result = await pool.query(`
            SELECT 
                vp.*, 
                p.per_nombre || ' ' || p.per_apellidos AS personal_nombre,
                r.rol_nombre,
                r.rol_puntos_reparto
            FROM viaje_personal vp
            LEFT JOIN personal p ON vp.via_per_fk_personal = p.per_id
            LEFT JOIN rol r ON vp.via_per_fk_rol = r.rol_id
            WHERE vp.via_per_fk_viaje = $1
            ORDER BY r.rol_puntos_reparto DESC, vp.via_per_id ASC
        `, [viajeId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener tripulación del viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Asignar un tripulante a un viaje y sumar su salario base al presupuesto
const createTripulante = async (req, res) => {
    const client = await pool.connect();
    try {
        const { via_per_fk_viaje, via_per_fk_personal, via_per_fk_rol } = req.body;

        await client.query('BEGIN');

        // Validar si el tripulante ya está asignado a este viaje
        const existe = await client.query(
            'SELECT 1 FROM viaje_personal WHERE via_per_fk_viaje = $1 AND via_per_fk_personal = $2',
            [via_per_fk_viaje, via_per_fk_personal]
        );
        
        if (existe.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Este tripulante ya está enrolado en este viaje.' });
        }

        // Obtener el salario base del personal
        const personalRes = await client.query('SELECT per_salario_base FROM personal WHERE per_id = $1', [via_per_fk_personal]);
        const salarioBase = parseFloat(personalRes.rows[0]?.per_salario_base || 0);

        // Insertar en viaje_personal
        const result = await client.query(
            `INSERT INTO viaje_personal 
            (via_per_fk_viaje, via_per_fk_personal, via_per_fk_rol) 
            VALUES ($1, $2, $3) RETURNING *`,
            [via_per_fk_viaje, via_per_fk_personal, via_per_fk_rol]
        );

        // Actualizar Presupuesto del Viaje
        await client.query(`
            UPDATE viaje 
            SET via_presupuesto_estimado = via_presupuesto_estimado + $1
            WHERE via_id = $2
        `, [salarioBase, via_per_fk_viaje]);

        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al registrar tripulante en viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        client.release();
    }
};

// Eliminar un tripulante del viaje y restar su salario base del presupuesto
const deleteTripulante = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;

        await client.query('BEGIN');

        // Obtener datos antes de borrar
        const vpRes = await client.query(`
            SELECT vp.via_per_fk_viaje, p.per_salario_base 
            FROM viaje_personal vp
            JOIN personal p ON vp.via_per_fk_personal = p.per_id
            WHERE vp.via_per_id = $1
        `, [id]);

        if (vpRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Registro de tripulante no encontrado' });
        }

        const { via_per_fk_viaje, per_salario_base } = vpRes.rows[0];
        const salarioBase = parseFloat(per_salario_base || 0);

        // Eliminar
        await client.query('DELETE FROM viaje_personal WHERE via_per_id = $1', [id]);

        // Actualizar Presupuesto
        await client.query(`
            UPDATE viaje 
            SET via_presupuesto_estimado = via_presupuesto_estimado - $1
            WHERE via_id = $2
        `, [salarioBase, via_per_fk_viaje]);

        await client.query('COMMIT');
        res.json({ message: 'Tripulante desembarcado del viaje exitosamente', salario_ajustado: salarioBase });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al eliminar tripulante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        client.release();
    }
};

// Actualizar un rol/asignación de tripulante
const updateTripulante = async (req, res) => {
    try {
        const { id } = req.params;
        const { via_per_fk_viaje, via_per_fk_personal, via_per_fk_rol } = req.body;

        const result = await pool.query(
            `UPDATE viaje_personal 
            SET via_per_fk_viaje = $1, 
                via_per_fk_personal = $2, 
                via_per_fk_rol = $3 
            WHERE via_per_id = $4 RETURNING *`,
            [via_per_fk_viaje, via_per_fk_personal, via_per_fk_rol, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Registro de tripulante no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar tripulante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getTripulacion,
    getTripulanteById,
    getTripulacionByViajeId,
    createTripulante,
    updateTripulante,
    deleteTripulante
};
