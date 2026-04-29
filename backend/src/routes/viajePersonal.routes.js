const express = require('express');
const router = express.Router();
const viajePersonalController = require('../controllers/viajePersonal.controller');

router.get('/', viajePersonalController.getTripulacion);
router.get('/viaje/:viajeId', viajePersonalController.getTripulacionByViajeId);
router.get('/:id', viajePersonalController.getTripulanteById);
router.post('/', viajePersonalController.createTripulante);
router.put('/:id', viajePersonalController.updateTripulante);
router.delete('/:id', viajePersonalController.deleteTripulante);

module.exports = router;
