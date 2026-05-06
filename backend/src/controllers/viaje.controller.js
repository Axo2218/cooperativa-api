const pool = require('../config/db');

// OBTENER TODOS LOS VIAJES (Full data para Dashboard y CRUD)
const obtenerViajes = async (req, res) => {
    try {
        const { archivados } = req.query;
        const isArchivado = archivados === 'true';

        const query = `
        SELECT 
            v.*, 
            e.emb_nombre AS barco, 
            e.emb_capacidad_personal AS capacidad, 
            e.emb_matricula,
            e.emb_latitud,
            e.emb_longitud,
            p.per_nombre || ' ' || p.per_apellidos AS capitan,
            z.zona_nombre,
            inst.inst_nombre AS puerto_arribo
        FROM viaje v
        LEFT JOIN embarcacion e ON v.via_fk_embarcacion = e.emb_id
        LEFT JOIN personal p ON v.via_fk_capitan = p.per_id
        LEFT JOIN zona_pesca z ON v.via_fk_zona = z.zona_id
        LEFT JOIN instalacion inst ON v.via_fk_puerto = inst.inst_id
        WHERE v.via_archivado = $1
        ORDER BY v.via_id DESC
        `;
        const respuesta = await pool.query(query, [isArchivado]);
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
                e.emb_categoria,
                e.emb_capacidad_carga,
                e.emb_latitud,
                e.emb_longitud,
                e.emb_fk_cooperativa,
                c.coop_fk_instalacion AS id_bodega,
                p.per_nombre || ' ' || p.per_apellidos AS capitan,
                z.zona_nombre,
                z.zona_cuadrante,
                inst.inst_nombre AS puerto_arribo
            FROM viaje v
            LEFT JOIN embarcacion e ON v.via_fk_embarcacion = e.emb_id
            LEFT JOIN cooperativa c ON e.emb_fk_cooperativa = c.coop_id
            LEFT JOIN personal p ON v.via_fk_capitan = p.per_id
            LEFT JOIN zona_pesca z ON v.via_fk_zona = z.zona_id
            LEFT JOIN instalacion inst ON v.via_fk_puerto = inst.inst_id
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
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { via_estatus, via_fecha_llegada, via_observaciones, via_fk_puerto } = req.body; 

        await client.query('BEGIN');

        const query = `
            UPDATE viaje 
            SET via_estatus = $1, 
                via_fecha_llegada = COALESCE($2, via_fecha_llegada), 
                via_observaciones = COALESCE($3, via_observaciones),
                via_fk_puerto = COALESCE($4, via_fk_puerto)
            WHERE via_id = $5 RETURNING *
        `;

        const actualizar = await client.query(query, [via_estatus, via_fecha_llegada || null, via_observaciones || null, via_fk_puerto || null, id]);

        if (actualizar.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ mensaje: "Viaje no encontrado" });
        }

        const viajeActualizado = actualizar.rows[0];

        // LÓGICA DE ACTUALIZACIÓN DE POSICIÓN GPS AL ARRIBAR A PUERTO
        if (via_estatus === 'En Puerto' && via_fk_puerto) {
            const puertoData = await client.query(
                "SELECT inst_latitud, inst_longitud FROM instalacion WHERE inst_id = $1",
                [via_fk_puerto]
            );
            
            if (puertoData.rows.length > 0) {
                const { inst_latitud, inst_longitud } = puertoData.rows[0];
                if (inst_latitud && inst_longitud) {
                    await client.query(
                        "UPDATE embarcacion SET emb_latitud = $1, emb_longitud = $2 WHERE emb_id = $3",
                        [inst_latitud, inst_longitud, viajeActualizado.via_fk_embarcacion]
                    );
                    console.log(`⚓ Posición de la embarcación ${viajeActualizado.via_fk_embarcacion} actualizada al puerto ${via_fk_puerto}`);
                }
            }
        }

        // LÓGICA DE INVENTARIO PERSISTENTE:
        // Si el viaje pasa a 'En Preparación', cargamos automáticamente lo que el barco ya tiene en su bodega persistente.
        if (via_estatus === 'En Preparación') {
            await client.query(`
                INSERT INTO viaje_insumo (vi_fk_viaje, vi_fk_insumo, vi_cantidad)
                SELECT $1, ie_fk_insumo, ie_cantidad
                FROM inventario_embarcacion
                WHERE ie_fk_embarcacion = $2
                ON CONFLICT DO NOTHING
            `, [id, viajeActualizado.via_fk_embarcacion]);

            // CARGA AUTOMÁTICA DE GASTOS: Convertimos el inventario del barco en gastos operativos
            await client.query(`
                INSERT INTO viaje_gasto (gas_fk_viaje, gas_fk_insumo, gas_cantidad, gas_precio_unitario, gas_pagado_por_cooperativa)
                SELECT $1, ie.ie_fk_insumo, ie.ie_cantidad, i.ins_costo_unitario_referencia, true
                FROM inventario_embarcacion ie
                JOIN insumo i ON ie.ie_fk_insumo = i.ins_id
                WHERE ie.ie_fk_embarcacion = $2
                ON CONFLICT DO NOTHING
            `, [id, viajeActualizado.via_fk_embarcacion]);
        }

        await client.query('COMMIT');
        res.status(200).json({ mensaje: `Estatus actualizado a: ${via_estatus}`, viaje: viajeActualizado });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Error al cambiar de estatus' });
    } finally {
        client.release();
    }
};

// ARCHIVAR UN VIAJE (Ocultar del dashboard)
const archivarViaje = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("UPDATE viaje SET via_archivado = true WHERE via_id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Viaje no encontrado' });
        res.json({ mensaje: 'Viaje archivado correctamente', viaje: result.rows[0] });
    } catch (error) {
        console.error('Error al archivar viaje:', error);
        res.status(500).json({ error: 'Error al archivar el viaje' });
    }
};

// DESARCHIVAR UN VIAJE (Regresar al dashboard)
const desarchivarViaje = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("UPDATE viaje SET via_archivado = false WHERE via_id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Viaje no encontrado' });
        res.json({ mensaje: 'Viaje recuperado correctamente', viaje: result.rows[0] });
    } catch (error) {
        console.error('Error al desarchivar viaje:', error);
        res.status(500).json({ error: 'Error al desarchivar el viaje' });
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
        if (error.code === '23503' || error.code === '23001') {
            return res.status(400).json({ error: 'No se puede eliminar el viaje porque tiene información (gastos, capturas, liquidaciones o tripulación) asociada.' });
        }
        res.status(500).json({ error: 'Error crítico al intentar eliminar el viaje' });
    }
};

// FINALIZAR VIAJE (Cierre de bitácora y liquidación)
const finalizarViaje = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        await client.query('BEGIN');
        
        // 1. Obtener datos del viaje y la cooperativa
        const viajeData = await client.query(`
            SELECT v.*, c.coop_porcentaje_retencion 
            FROM viaje v
            LEFT JOIN embarcacion e ON v.via_fk_embarcacion = e.emb_id
            LEFT JOIN cooperativa c ON e.emb_fk_cooperativa = c.coop_id
            WHERE v.via_id = $1
        `, [id]);

        if (viajeData.rows.length === 0) throw new Error('Viaje no encontrado');
        const viaje = viajeData.rows[0];
        const pctCoop = parseFloat(viaje.coop_porcentaje_retencion || 30) / 100;

        // 2. Calcular totales de captura
        const capturas = await client.query(`
            SELECT SUM(det_cap_kilogramos) as total_kg, 
                   SUM(det_cap_kilogramos * det_cap_precio_pactado) as total_ingresos 
            FROM viaje_detalle_captura 
            WHERE det_cap_fk_viaje = $1
        `, [id]);
        
        const total_kg = parseFloat(capturas.rows[0].total_kg || 0);
        const total_ingresos = parseFloat(capturas.rows[0].total_ingresos || 0);
        const presupuesto = parseFloat(viaje.via_presupuesto_estimado || 0);

        // 3. Cálculo de Ganancias y Reparto
        const ganancia_neta = total_ingresos - presupuesto;
        let reparto_coop = 0;
        let reparto_cap = 0;
        let reparto_trip = 0;

        if (ganancia_neta > 0) {
            reparto_coop = ganancia_neta * pctCoop;
            const remanente = ganancia_neta - reparto_coop;
            reparto_cap = remanente * 0.30; // 30% del remanente al capitán
            reparto_trip = remanente * 0.70; // 70% del remanente a la tripulación
        }
        
        // 4. Desembarcar tripulación
        await client.query("UPDATE viaje_personal SET via_per_enrolado = FALSE WHERE via_per_fk_viaje = $1", [id]);

        // 5. Actualizar el viaje con los resultados finales
        const result = await client.query(`
            UPDATE viaje 
            SET via_estatus = 'Completado', 
                via_fecha_llegada = CURRENT_TIMESTAMP,
                via_total_kg = $1,
                via_total_ingresos = $2,
                via_ganancia_neta = $3,
                via_reparto_cooperativa = $4,
                via_reparto_capitan = $5,
                via_reparto_tripulacion = $6
            WHERE via_id = $7 RETURNING *
        `, [total_kg, total_ingresos, ganancia_neta, reparto_coop, reparto_cap, reparto_trip, id]);

        // 6. CREACIÓN AUTOMÁTICA DE LOTE (Misión Inventario)
        // Solo si hay captura, creamos un lote para su trazabilidad y venta.
        if (total_kg > 0) {
            await client.query(`
                INSERT INTO lote_pesca 
                (lote_fk_viaje, lote_costo_operativo_total, lote_kilos_totales_recibidos, lote_stock_actual)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT DO NOTHING -- Evita duplicados si se re-finaliza
            `, [id, presupuesto, total_kg, total_kg]);
        }
        
        await client.query('COMMIT');
        res.json({ mensaje: 'Viaje finalizado y liquidado correctamente', viaje: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al finalizar viaje:', error);
        res.status(500).json({ error: 'Error al procesar el cierre del viaje: ' + error.message });
    } finally {
        client.release();
    }
};

module.exports = {
    obtenerViajes,
    getViajeById,
    crearViaje,
    updateViaje,
    actualizarEstatusViaje,
    eliminarViaje,
    archivarViaje,
    desarchivarViaje,
    finalizarViaje
};