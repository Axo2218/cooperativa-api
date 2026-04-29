const { Router } = require('express');
const router = Router();
const {
    obtenerViajes,
    getViajeById,
    crearViaje,
    updateViaje,
    actualizarEstatusViaje,
    eliminarViaje
} = require('../controllers/viaje.controller');

// Rutas originales para compatibilidad con frontend anterior
router.get('/viajes', obtenerViajes);
router.post('/viajes', crearViaje);
router.put('/viajes/:id/estatus', actualizarEstatusViaje);
router.delete('/viajes/:id', eliminarViaje);

// Rutas estándar CRUD
router.get('/', obtenerViajes);
router.get('/:id', getViajeById);
router.post('/', crearViaje);
router.put('/:id', updateViaje);
router.delete('/:id', eliminarViaje);

module.exports = router;