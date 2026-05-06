const pool = require('../config/db');

// Obtener todos los gastos de viajes
const getGastos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                g.*, 
                v.via_fecha_salida,
                v.via_estatus,
                i.ins_nombre,
                i.ins_unidad_medida,
                (g.gas_cantidad * g.gas_precio_unitario) AS gas_subtotal
            FROM viaje_gasto g
            LEFT JOIN viaje v ON g.gas_fk_viaje = v.via_id
            LEFT JOIN insumo i ON g.gas_fk_insumo = i.ins_id
            WHERE v.via_archivado = false OR v.via_estatus = 'Completado'
            ORDER BY g.gas_id DESC
            LIMIT 100
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los gastos de viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener un gasto por ID
const getGastoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT 
                g.*,
                (g.gas_cantidad * g.gas_precio_unitario) AS gas_subtotal
            FROM viaje_gasto g 
            WHERE gas_id = $1
        `, [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Gasto de viaje no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el gasto de viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener gastos por ID de viaje (Útil para la liquidación final)
const getGastosByViajeId = async (req, res) => {
    try {
        const { viajeId } = req.params;
        const result = await pool.query(`
            SELECT 
                g.*, 
                i.ins_nombre,
                i.ins_unidad_medida,
                (g.gas_cantidad * g.gas_precio_unitario) AS gas_subtotal
            FROM viaje_gasto g
            LEFT JOIN insumo i ON g.gas_fk_insumo = i.ins_id
            WHERE g.gas_fk_viaje = $1
            ORDER BY g.gas_id ASC
        `, [viajeId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener gastos del viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Crear un gasto
const createGasto = async (req, res) => {
    try {
        const {
            gas_fk_viaje,
            gas_fk_insumo,
            gas_cantidad,
            gas_precio_unitario,
            gas_pagado_por_cooperativa
        } = req.body;

        const result = await pool.query(
            `INSERT INTO viaje_gasto 
            (gas_fk_viaje, gas_fk_insumo, gas_cantidad, gas_precio_unitario, gas_pagado_por_cooperativa) 
            VALUES ($1, $2, $3, $4, COALESCE($5, true)) RETURNING *`,
            [gas_fk_viaje, gas_fk_insumo, gas_cantidad, gas_precio_unitario, gas_pagado_por_cooperativa]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al registrar gasto de viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar un gasto
const updateGasto = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            gas_fk_viaje,
            gas_fk_insumo,
            gas_cantidad,
            gas_precio_unitario,
            gas_pagado_por_cooperativa
        } = req.body;

        const result = await pool.query(
            `UPDATE viaje_gasto 
            SET gas_fk_viaje = $1, 
                gas_fk_insumo = $2, 
                gas_cantidad = $3, 
                gas_precio_unitario = $4, 
                gas_pagado_por_cooperativa = $5 
            WHERE gas_id = $6 RETURNING *`,
            [gas_fk_viaje, gas_fk_insumo, gas_cantidad, gas_precio_unitario, gas_pagado_por_cooperativa, id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Gasto de viaje no encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar gasto de viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Eliminar un gasto
const deleteGasto = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM viaje_gasto WHERE gas_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Gasto de viaje no encontrado' });
        res.json({ message: 'Gasto de viaje eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar gasto de viaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getGastos,
    getGastoById,
    getGastosByViajeId,
    createGasto,
    updateGasto,
    deleteGasto
};
