const express = require('express');
const router = express.Router();
const embarcacionController = require('../controllers/embarcacion.controller');

router.get('/', embarcacionController.getEmbarcaciones);
router.get('/:id', embarcacionController.getEmbarcacionById);
router.post('/', embarcacionController.createEmbarcacion);
router.put('/:id', embarcacionController.updateEmbarcacion);
router.delete('/:id', embarcacionController.deleteEmbarcacion);

module.exports = router;
