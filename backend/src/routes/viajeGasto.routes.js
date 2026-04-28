const express = require('express');
const router = express.Router();
const viajeGastoController = require('../controllers/viajeGasto.controller');

router.get('/', viajeGastoController.getGastos);
router.get('/viaje/:viajeId', viajeGastoController.getGastosByViajeId);
router.get('/:id', viajeGastoController.getGastoById);
router.post('/', viajeGastoController.createGasto);
router.put('/:id', viajeGastoController.updateGasto);
router.delete('/:id', viajeGastoController.deleteGasto);

module.exports = router;
