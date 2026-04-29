const express = require('express');
const router = express.Router();
const alertaSistemaController = require('../controllers/alertaSistema.controller');

router.get('/', alertaSistemaController.getAlertas);
router.get('/:id', alertaSistemaController.getAlertaById);
router.post('/', alertaSistemaController.createAlerta);
router.put('/:id', alertaSistemaController.updateAlerta);
router.delete('/:id', alertaSistemaController.deleteAlerta);

module.exports = router;
