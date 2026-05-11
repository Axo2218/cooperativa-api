const axios = require('axios');

async function testUpdate() {
    try {
        const viaje = {
            via_id: 1, // Assuming a trip exists
            via_estatus: 'En Preparación',
            via_fk_embarcacion: 1,
            via_fk_capitan: 1,
            via_fk_zona: 1,
            via_presupuesto_estimado: 5000,
            via_fecha_salida: '2026-05-07',
            via_fecha_estimada: '2026-05-10',
            via_fecha_llegada: null,
            via_observaciones: 'Test'
        };

        const res = await axios.put('http://localhost:3000/api/viajes/1', viaje);
        console.log('Success:', res.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testUpdate();
