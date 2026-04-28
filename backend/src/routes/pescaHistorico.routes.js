const express = require('express');
const router = express.Router();
const pescaHistoricoController = require('../controllers/pescaHistorico.controller');

router.get('/', pescaHistoricoController.getPescaHistorico);
router.get('/:id', pescaHistoricoController.getPescaHistoricoById);
router.post('/', pescaHistoricoController.createPescaHistorico);
router.put('/:id', pescaHistoricoController.updatePescaHistorico);
router.delete('/:id', pescaHistoricoController.deletePescaHistorico);

module.exports = router;
