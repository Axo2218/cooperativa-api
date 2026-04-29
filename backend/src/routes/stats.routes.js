const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');

router.get('/dashboard', statsController.getDashboardStats);
router.get('/vessel-history/:id', statsController.getVesselStats);

module.exports = router;
