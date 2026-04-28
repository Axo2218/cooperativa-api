const { Router } = require('express');
const router = Router();
const {
    obtenerViajes,
    crearViaje,
    actualizarEstatusViaje,
    eliminarViaje // <-- Importamos la nueva función
} = require('../controllers/viaje.controller');

router.get('/viajes', obtenerViajes);
router.post('/viajes', crearViaje);
router.put('/viajes/:id/estatus', actualizarEstatusViaje);
router.delete('/viajes/:id', eliminarViaje); // <-- La nueva ruta destructiva

module.exports = router;