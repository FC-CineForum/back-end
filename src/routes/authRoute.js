const express = require('express');

const { authValidator } = require('../validators');
const { authController } = require('../controllers');

const router = express.Router();

router.post('/signUp',  
authValidator.signUp, authController.signUp);

router.post('/logIn',  
authValidator.logIn, authController.logIn);

router.post('/verifyAccount/:token',  
authValidator.verifyAccount, authController.verifyAccount);

module.exports = router;