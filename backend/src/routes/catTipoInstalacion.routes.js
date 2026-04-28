const express = require('express');
const router = express.Router();
const catTipoInstalacionController = require('../controllers/catTipoInstalacion.controller');

router.get('/', catTipoInstalacionController.getTiposInstalacion);
router.get('/:id', catTipoInstalacionController.getTipoInstalacionById);
router.post('/', catTipoInstalacionController.createTipoInstalacion);
router.put('/:id', catTipoInstalacionController.updateTipoInstalacion);
router.delete('/:id', catTipoInstalacionController.deleteTipoInstalacion);

module.exports = router;
