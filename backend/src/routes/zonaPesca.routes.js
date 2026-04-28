const express = require('express');
const router = express.Router();
const zonaController = require('../controllers/zonaPesca.controller');

router.get('/', zonaController.getZonas);
router.get('/:id', zonaController.getZonaById);
router.post('/', zonaController.createZona);
router.put('/:id', zonaController.updateZona);
router.delete('/:id', zonaController.deleteZona);

module.exports = router;
