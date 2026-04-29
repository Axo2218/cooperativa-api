const express = require('express');
const router = express.Router();
const controller = require('../controllers/viajeInsumo.controller');

router.get('/viaje/:id', controller.getInsumosViaje);
router.get('/bodega/:id_bodega', controller.getInventarioDisponible);
router.post('/', controller.asignarInsumoViaje);
router.post('/reconciliar', controller.reconciliarInsumoViaje);

module.exports = router;
