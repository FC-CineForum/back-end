const express = require('express');

const { celebrityController } = require('../controllers');
const { celebrityValidator } = require('../validators');

const router = express.Router();

router.post('/celebrity/', 
celebrityValidator.addCelebrity, celebrityController.addCelebrity);

module.exports = router;