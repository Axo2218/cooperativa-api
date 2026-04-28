const { Router } = require('express');
const router = Router();
const {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} = require('../controllers/categoria.controller');

// Definimos todas las rutas tácticas
router.get('/categorias', obtenerCategorias);
router.get('/categorias/:id', obtenerCategoria); //<-- Ruta para buscar una específica
router.post('/categorias', crearCategoria);
router.put('/categorias/:id', actualizarCategoria); //<-- La ruta que te faltaba para el PUT
router.delete('/categorias/:id', eliminarCategoria); //<-- La ruta para el DELETE

module.exports = router;