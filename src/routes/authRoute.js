const express = require('express');

const { authValidator } = require('../validators');
const { authController } = require('../controllers');

const router = express.Router();

router.post('/signUp',  
authValidator.signUp, authController.signUp);

module.exports = router;