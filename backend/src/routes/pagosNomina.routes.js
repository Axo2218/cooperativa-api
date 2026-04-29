const express = require('express');
const router = express.Router();
const pagosNominaController = require('../controllers/pagosNomina.controller');

router.get('/', pagosNominaController.getPagosNomina);
router.get('/:id', pagosNominaController.getPagoNominaById);
router.post('/', pagosNominaController.createPagoNomina);
router.put('/:id', pagosNominaController.updatePagoNomina);
router.delete('/:id', pagosNominaController.deletePagoNomina);

module.exports = router;
