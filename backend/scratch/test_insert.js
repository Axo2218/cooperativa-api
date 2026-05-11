const pool = require('../src/config/db');
async function testInsert() {
    try {
        // IDs manuales aproximados basados en lo que vimos antes
        const via_fecha_salida = '2026-05-07T01:14:00';
        const via_fecha_estimada = '2026-05-21';
        const via_estatus = 'Pendiente';
        const via_presupuesto_estimado = 3485.07;
        
        // Buscar IDs reales
        const embRes = await pool.query("SELECT emb_id FROM embarcacion WHERE emb_nombre ILIKE 'Mar de Plata' LIMIT 1");
        const capRes = await pool.query("SELECT per_id FROM personal WHERE per_nombre ILIKE 'Ruben' LIMIT 1");
        const zonaRes = await pool.query("SELECT zona_id FROM zona_pesca WHERE zona_nombre ILIKE 'Litoral de Frontera' LIMIT 1");
        
        const emb_id = embRes.rows[0]?.emb_id;
        const cap_id = capRes.rows[0]?.per_id;
        const zona_id = zonaRes.rows[0]?.zona_id;
        
        console.log('Probando inserción con:', {emb_id, cap_id, zona_id});

        const query = `
            INSERT INTO viaje 
            (via_fecha_salida, via_estatus, via_fk_embarcacion, via_fk_capitan, via_fecha_estimada, via_presupuesto_estimado, via_fk_zona) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `;
        const res = await pool.query(query, [via_fecha_salida, via_estatus, emb_id, cap_id, via_fecha_estimada, via_presupuesto_estimado, zona_id]);
        console.log('Éxito:', res.rows[0]);
    } catch (e) {
        console.error('ERROR DETECTADO:', e.message);
        if (e.detail) console.error('DETALLE:', e.detail);
    } finally {
        process.exit(0);
    }
}
testInsert();
