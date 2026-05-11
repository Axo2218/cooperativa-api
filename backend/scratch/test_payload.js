const pool = require('../src/config/db');
async function test() {
    try {
        const payload = {
            via_fecha_salida: '2026-05-07T01:14',
            via_fecha_llegada: '',
            via_estatus: 'Pendiente',
            via_observaciones: '',
            via_fk_embarcacion: '3',
            via_fk_capitan: '18',
            via_fecha_estimada: '2026-05-21',
            via_presupuesto_estimado: '3485.07',
            via_fk_zona: '1'
        };

        const {
            via_fecha_salida, via_fecha_llegada, via_estatus, via_observaciones,
            via_fk_embarcacion, via_fk_capitan, via_fecha_estimada, via_presupuesto_estimado, via_fk_zona
        } = payload;

        const fk_embarcacion = via_fk_embarcacion === '' ? null : via_fk_embarcacion;
        const fk_capitan = via_fk_capitan === '' ? null : via_fk_capitan;
        const fk_zona = via_fk_zona === '' ? null : via_fk_zona;
        const fecha_salida = via_fecha_salida === '' ? null : via_fecha_salida;
        const fecha_llegada = via_fecha_llegada === '' ? null : via_fecha_llegada;
        const fecha_estimada = via_fecha_estimada === '' ? null : via_fecha_estimada;

        const res = await pool.query(
            `INSERT INTO viaje 
            (via_fecha_salida, via_fecha_llegada, via_estatus, via_observaciones, via_fk_embarcacion, via_fk_capitan, via_fecha_estimada, via_presupuesto_estimado, via_fk_zona) 
            VALUES (COALESCE($1, CURRENT_TIMESTAMP), $2, COALESCE($3, 'Pendiente'), $4, $5, $6, $7, COALESCE($8, 0), $9) RETURNING *`,
            [fecha_salida, fecha_llegada, via_estatus || 'Pendiente', via_observaciones || null, fk_embarcacion, fk_capitan, fecha_estimada, via_presupuesto_estimado || 0, fk_zona]
        );
        console.log('SUCCESS:', res.rows[0]);
    } catch (e) {
        console.error('FAIL:', e.message, e.detail);
    } finally {
        process.exit(0);
    }
}
test();
