const pool = require('./src/config/db');

async function testQuery() {
    try {
        const result = await pool.query(`
            SELECT 
                m.mant_id, 
                m.mant_fk_embarcacion, 
                m.mant_fecha_inicio, 
                m.mant_fecha_fin, 
                m.mant_descripcion, 
                m.mant_costo, 
                m.mant_estado,
                e.emb_nombre, 
                e.emb_matricula
            FROM mantenimiento_embarcacion m
            JOIN embarcacion e ON m.mant_fk_embarcacion = e.emb_id
            
            UNION ALL
            
            SELECT 
                NULL as mant_id, 
                e.emb_id as mant_fk_embarcacion, 
                CURRENT_DATE as mant_fecha_inicio, 
                NULL as mant_fecha_fin, 
                'En mantenimiento (Sin registro detallado)' as mant_descripcion, 
                0 as mant_costo, 
                'En Proceso' as mant_estado, 
                e.emb_nombre, 
                e.emb_matricula
            FROM embarcacion e
            WHERE e.emb_estatus = 'En Mantenimiento'
            AND e.emb_id NOT IN (
                SELECT mant_fk_embarcacion 
                FROM mantenimiento_embarcacion 
                WHERE mant_estado IN ('En Proceso', 'Pendiente')
            )
            
            ORDER BY mant_fecha_inicio DESC, mant_id DESC
        `);
        console.log('Resultados:', JSON.stringify(result.rows, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

testQuery();
