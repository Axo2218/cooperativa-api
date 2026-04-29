const pool = require('../config/db');

// Obtener insumos asignados a un viaje
const getInsumosViaje = async (req, res) => {
    try {
        const { id } = req.params; // via_id
        const result = await pool.query(`
            SELECT vi.*, i.ins_nombre, i.ins_unidad_medida
            FROM viaje_insumo vi
            JOIN insumo i ON vi.vi_fk_insumo = i.ins_id
            WHERE vi.vi_fk_viaje = $1
            ORDER BY vi.vi_id DESC
        `, [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener insumos del viaje' });
    }
};

// Obtener inventario disponible para la bodega de la cooperativa
const getInventarioDisponible = async (req, res) => {
    try {
        const { id_bodega } = req.params;
        const result = await pool.query(`
            SELECT inv.*, i.ins_nombre, i.ins_unidad_medida, i.ins_categoria, i.ins_costo_unitario_referencia
            FROM inventario_insumos inv
            JOIN insumo i ON inv.inv_fk_insumo = i.ins_id
            WHERE inv.inv_fk_instalacion = $1
        `, [id_bodega]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener inventario' });
    }
};

// Asignar o Actualizar insumo al viaje (Moviendo entre bodega y barco)
const asignarInsumoViaje = async (req, res) => {
    const client = await pool.connect();
    try {
        const { via_id, ins_id, cantidad, id_bodega } = req.body;
        const nuevaCantidad = parseFloat(cantidad);
        
        await client.query('BEGIN');

        // 1. Obtener cantidad actual en el barco
        const currentBoatRes = await client.query(`
            SELECT vi_cantidad FROM viaje_insumo 
            WHERE vi_fk_viaje = $1 AND vi_fk_insumo = $2
        `, [via_id, ins_id]);
        
        const cantidadActualBarco = currentBoatRes.rows.length > 0 ? parseFloat(currentBoatRes.rows[0].vi_cantidad) : 0;
        const diferencia = nuevaCantidad - cantidadActualBarco;

        if (diferencia === 0) {
            await client.query('COMMIT');
            return res.json({ mensaje: 'Sin cambios necesarios' });
        }

        // 2. Obtener info de stock y costo
        const stockRes = await client.query(`
            SELECT inv_cantidad_actual, i.ins_costo_unitario_referencia
            FROM inventario_insumos inv
            JOIN insumo i ON inv.inv_fk_insumo = i.ins_id
            WHERE inv.inv_fk_instalacion = $1 AND inv.inv_fk_insumo = $2
        `, [id_bodega, ins_id]);

        if (stockRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Insumo no encontrado en bodega' });
        }

        const stockActualBodega = parseFloat(stockRes.rows[0].inv_cantidad_actual);
        const costoUnitario = parseFloat(stockRes.rows[0].ins_costo_unitario_referencia || 0);

        // 3. Validar si hay stock suficiente si estamos agregando
        if (diferencia > 0 && stockActualBodega < diferencia) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Stock insuficiente en bodega para el incremento', insuficiente: true });
        }

        // 4. Actualizar Bodega (Restar la diferencia)
        await client.query(`
            UPDATE inventario_insumos 
            SET inv_cantidad_actual = inv_cantidad_actual - $1,
                inv_ultima_actualizacion = CURRENT_TIMESTAMP
            WHERE inv_fk_instalacion = $2 AND inv_fk_insumo = $3
        `, [diferencia, id_bodega, ins_id]);

        // 5. Actualizar Barco (viaje_insumo)
        if (currentBoatRes.rows.length > 0) {
            if (nuevaCantidad === 0) {
                await client.query(`DELETE FROM viaje_insumo WHERE vi_fk_viaje = $1 AND vi_fk_insumo = $2`, [via_id, ins_id]);
            } else {
                await client.query(`UPDATE viaje_insumo SET vi_cantidad = $1 WHERE vi_fk_viaje = $2 AND vi_fk_insumo = $3`, [nuevaCantidad, via_id, ins_id]);
            }
        } else if (nuevaCantidad > 0) {
            await client.query(`INSERT INTO viaje_insumo (vi_fk_viaje, vi_fk_insumo, vi_cantidad) VALUES ($1, $2, $3)`, [via_id, ins_id, nuevaCantidad]);
        }

        // 6. Actualizar Presupuesto del Viaje
        const ajustePresupuesto = diferencia * costoUnitario;
        await client.query(`
            UPDATE viaje 
            SET via_presupuesto_estimado = via_presupuesto_estimado + $1
            WHERE via_id = $2
        `, [ajustePresupuesto, via_id]);

        await client.query('COMMIT');
        res.json({ mensaje: 'Sincronización barco-bodega exitosa', ajuste_presupuesto: ajustePresupuesto });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Error al sincronizar insumos' });
    } finally {
        client.release();
    }
};

// Reconciliación final de insumos al terminar el viaje
const reconciliarInsumoViaje = async (req, res) => {
    const client = await pool.connect();
    try {
        const { via_id, emb_id, ins_id, accion, id_bodega, cantidad: cantidadAProcesar } = req.body;
        // accion: 'devolver', 'mantener', 'perdido'
        const qty = parseFloat(cantidadAProcesar);

        if (isNaN(qty) || qty <= 0) {
            return res.status(400).json({ error: 'Cantidad no válida' });
        }

        await client.query('BEGIN');

        // 1. Obtener cantidad actual en el barco para este viaje
        const boatRes = await client.query(`
            SELECT vi_cantidad FROM viaje_insumo 
            WHERE vi_fk_viaje = $1 AND vi_fk_insumo = $2
        `, [via_id, ins_id]);

        if (boatRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Insumo no encontrado en el barco para este viaje' });
        }

        const cantidadTotalEnBarco = parseFloat(boatRes.rows[0].vi_cantidad);

        if (qty > cantidadTotalEnBarco) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'La cantidad a procesar excede lo disponible a bordo' });
        }

        if (accion === 'devolver') {
            // Regresar el stock a la bodega
            await client.query(`
                UPDATE inventario_insumos 
                SET inv_cantidad_actual = inv_cantidad_actual + $1,
                    inv_ultima_actualizacion = CURRENT_TIMESTAMP
                WHERE inv_fk_instalacion = $2 AND inv_fk_insumo = $3
            `, [qty, id_bodega, ins_id]);
        } 
        else if (accion === 'mantener') {
            // Mover al inventario persistente de la embarcación
            await client.query(`
                INSERT INTO inventario_embarcacion (ie_fk_embarcacion, ie_fk_insumo, ie_cantidad)
                VALUES ($1, $2, $3)
                ON CONFLICT (ie_fk_embarcacion, ie_fk_insumo) 
                DO UPDATE SET ie_cantidad = inventario_embarcacion.ie_cantidad + $3,
                               ie_ultima_actualizacion = CURRENT_TIMESTAMP
            `, [emb_id, ins_id, qty]);
        }
        // Si es 'perdido', simplemente no regresa a bodega ni va al inventario persistente

        // Restar de la tabla viaje_insumo (del viaje actual)
        if (qty >= cantidadTotalEnBarco) {
            await client.query(`DELETE FROM viaje_insumo WHERE vi_fk_viaje = $1 AND vi_fk_insumo = $2`, [via_id, ins_id]);
        } else {
            await client.query(`UPDATE viaje_insumo SET vi_cantidad = vi_cantidad - $1 WHERE vi_fk_viaje = $2 AND vi_fk_insumo = $3`, [qty, via_id, ins_id]);
        }

        await client.query('COMMIT');
        res.json({ 
            mensaje: `Se procesaron ${qty} unidades como ${accion}`,
            quedan: cantidadTotalEnBarco - qty
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al reconciliar insumo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        client.release();
    }
};

module.exports = {
    getInsumosViaje,
    getInventarioDisponible,
    asignarInsumoViaje,
    reconciliarInsumoViaje
};
