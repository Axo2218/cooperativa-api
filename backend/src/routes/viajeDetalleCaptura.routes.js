const express = require('express');
const router = express.Router();
const viajeDetalleCapturaController = require('../controllers/viajeDetalleCaptura.controller');

router.get('/', viajeDetalleCapturaController.getCapturas);
router.get('/viaje/:viajeId', viajeDetalleCapturaController.getCapturasByViajeId);
router.get('/:id', viajeDetalleCapturaController.getCapturaById);
router.post('/', viajeDetalleCapturaController.createCaptura);
router.put('/:id', viajeDetalleCapturaController.updateCaptura);
router.delete('/:id', viajeDetalleCapturaController.deleteCaptura);

module.exports = router;
