const express = require('express');
const router = express.Router();
const activosFijosController = require('../controllers/activosFijos.controller');

router.get('/', activosFijosController.getActivosFijos);
router.get('/:id', activosFijosController.getActivoFijoById);
router.post('/', activosFijosController.createActivoFijo);
router.put('/:id', activosFijosController.updateActivoFijo);
router.delete('/:id', activosFijosController.deleteActivoFijo);

module.exports = router;
