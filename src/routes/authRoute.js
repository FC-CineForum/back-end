const express = require('express');

const { authValidator } = require('../validators');
const { authController } = require('../controllers');

const router = express.Router();

router.post('/signUp',  
authValidator.signUp, authController.signUp);

router.get('/get/:username', 
authValidator.get, authController.get);

router.post('/logIn',  
authValidator.logIn, authController.logIn);

module.exports = router;