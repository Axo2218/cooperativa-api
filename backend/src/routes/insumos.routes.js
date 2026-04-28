const express = require('express');
const router = express.Router();
const insumosController = require('../controllers/insumos.controller');

router.get('/', insumosController.getInsumos);
router.get('/:id', insumosController.getInsumoById);
router.post('/', insumosController.createInsumo);
router.put('/:id', insumosController.updateInsumo);
router.delete('/:id', insumosController.deleteInsumo);

module.exports = router;
