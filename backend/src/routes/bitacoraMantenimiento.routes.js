const express = require('express');
const router = express.Router();
const bitacoraMantenimientoController = require('../controllers/bitacoraMantenimiento.controller');

router.get('/', bitacoraMantenimientoController.getBitacoras);
router.get('/:id', bitacoraMantenimientoController.getBitacoraById);
router.post('/', bitacoraMantenimientoController.createBitacora);
router.put('/:id', bitacoraMantenimientoController.updateBitacora);
router.delete('/:id', bitacoraMantenimientoController.deleteBitacora);

module.exports = router;
