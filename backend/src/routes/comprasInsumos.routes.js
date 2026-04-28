const express = require('express');
const router = express.Router();
const comprasInsumosController = require('../controllers/comprasInsumos.controller');

router.get('/', comprasInsumosController.getComprasInsumos);
router.get('/:id', comprasInsumosController.getCompraInsumoById);
router.post('/', comprasInsumosController.createCompraInsumo);
router.put('/:id', comprasInsumosController.updateCompraInsumo);
router.delete('/:id', comprasInsumosController.deleteCompraInsumo);

module.exports = router;
