const express = require('express');
const router = express.Router();
const mantenimientoController = require('../controllers/mantenimientoEmbarcacion.controller');

router.get('/', mantenimientoController.getMantenimientos);
router.get('/:id', mantenimientoController.getMantenimientoById);
router.post('/', mantenimientoController.createMantenimiento);
router.put('/:id', mantenimientoController.updateMantenimiento);
router.delete('/:id', mantenimientoController.deleteMantenimiento);

module.exports = router;
