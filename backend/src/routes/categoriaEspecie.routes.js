const express = require('express');
const router = express.Router();
const categoriaEspecieController = require('../controllers/categoriaEspecie.controller');

router.get('/', categoriaEspecieController.getCategoriasEspecie);
router.get('/:id', categoriaEspecieController.getCategoriaEspecieById);
router.post('/', categoriaEspecieController.createCategoriaEspecie);
router.put('/:id', categoriaEspecieController.updateCategoriaEspecie);
router.delete('/:id', categoriaEspecieController.deleteCategoriaEspecie);

module.exports = router;
