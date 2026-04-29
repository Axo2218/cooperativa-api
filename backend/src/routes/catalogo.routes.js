const { Router } = require('express');
const router = Router();
const { obtenerCatalogos } = require('../controllers/catalogo.controller');

router.get('/catalogos', obtenerCatalogos);

module.exports = router;