const express = require('express');
const router = express.Router();
const especiesController = require('../controllers/especies.controller');

router.get('/', especiesController.getEspecies);
router.get('/:id', especiesController.getEspecieById);
router.post('/', especiesController.createEspecie);
router.put('/:id', especiesController.updateEspecie);
router.delete('/:id', especiesController.deleteEspecie);

module.exports = router;
