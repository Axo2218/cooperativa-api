const express = require('express');
const router = express.Router();
const catTipoActivoController = require('../controllers/catTipoActivo.controller');

router.get('/', catTipoActivoController.getTiposActivo);
router.get('/:id', catTipoActivoController.getTipoActivoById);
router.post('/', catTipoActivoController.createTipoActivo);
router.put('/:id', catTipoActivoController.updateTipoActivo);
router.delete('/:id', catTipoActivoController.deleteTipoActivo);

module.exports = router;
