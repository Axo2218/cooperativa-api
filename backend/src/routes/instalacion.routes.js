const express = require('express');
const router = express.Router();
const instalacionController = require('../controllers/instalacion.controller');

router.get('/', instalacionController.getInstalaciones);

module.exports = router;
