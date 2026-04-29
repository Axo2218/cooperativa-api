const express = require('express');
const router = express.Router();
const personalController = require('../controllers/personal.controller');

router.get('/', personalController.getPersonal);
router.get('/:id', personalController.getPersonalById);
router.post('/', personalController.createPersonal);
router.put('/:id', personalController.updatePersonal);
router.delete('/:id', personalController.deletePersonal);

module.exports = router;
