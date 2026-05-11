const axios = require('axios');

async function testUpdateFail() {
    try {
        const viaje = {
          "via_id": 1,
          "via_fecha_salida": "2026-05-07T06:00:00.000Z",
          "via_fecha_llegada": null,
          "via_estatus": "Pendiente",
          "via_observaciones": null,
          "via_fk_embarcacion": 1,
          "via_fk_capitan": 1,
          "via_fecha_estimada": null,
          "via_presupuesto_estimado": 5000,
          "via_fk_zona": 1,
          "barco": "La Gaviota I"
        };
        const nuevoPresupuesto = 5500;

        const res = await axios.put('http://localhost:3000/api/viajes/1', {
            ...viaje,
            via_presupuesto_estimado: nuevoPresupuesto
        });
        console.log('Success:', res.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testUpdateFail();
