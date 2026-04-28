const express = require('express');
const router = express.Router();
const cuotasController = require('../controllers/cuotas.controller');

router.get('/', cuotasController.getCuotas);
router.get('/:id', cuotasController.getCuotaById);
router.post('/', cuotasController.createCuota);
router.put('/:id', cuotasController.updateCuota);
router.delete('/:id', cuotasController.deleteCuota);

module.exports = router;
