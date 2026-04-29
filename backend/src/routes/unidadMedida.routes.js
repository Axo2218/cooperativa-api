const { Router } = require('express');
const router = Router();
const { getUnidadesMedida } = require('../controllers/unidadMedida.controller');

router.get('/', getUnidadesMedida);

module.exports = router;
