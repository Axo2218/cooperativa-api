const { Router } = require('express');
const router = Router();
const {
    obtenerViajes,
    getViajeById,
    crearViaje,
    updateViaje,
    actualizarEstatusViaje,
    eliminarViaje,
    archivarViaje,
    desarchivarViaje,
    finalizarViaje
} = require('../controllers/viaje.controller');

// Rutas originales para compatibilidad con frontend anterior
router.get('/viajes', obtenerViajes);
router.post('/viajes', crearViaje);
router.put('/estatus/:id', actualizarEstatusViaje);
router.put('/finalizar/:id', finalizarViaje);
router.put('/archivar/:id', archivarViaje);
router.patch('/viajes/:id/desarchivar', desarchivarViaje);
router.delete('/viajes/:id', eliminarViaje);

// Rutas estándar CRUD
router.get('/', obtenerViajes);
router.get('/:id', getViajeById);
router.post('/', crearViaje);
router.put('/:id', updateViaje);
router.patch('/:id/archivar', archivarViaje);
router.patch('/:id/desarchivar', desarchivarViaje);
router.delete('/:id', eliminarViaje);

module.exports = router;