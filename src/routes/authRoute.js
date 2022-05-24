const express = require('express');

const { authValidator } = require('../validators');
const { authController } = require('../controllers');

const router = express.Router();

router.post('/signUp',  
authValidator.signUp, authController.signUp);

router.post('/logIn',  
authValidator.logIn, authController.logIn);

router.get('/verifyAccount',  
authValidator.auth, authController.verifyAccount);

router.get('/getUser/',
authValidator.getUser, authController.getUser);

module.exports = router;