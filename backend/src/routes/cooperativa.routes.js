const express = require('express');
const router = express.Router();
const cooperativaController = require('../controllers/cooperativa.controller');

router.get('/', cooperativaController.getCooperativas);
router.get('/:id', cooperativaController.getCooperativaById);
router.post('/', cooperativaController.createCooperativa);
router.put('/:id', cooperativaController.updateCooperativa);
router.delete('/:id', cooperativaController.deleteCooperativa);

module.exports = router;
