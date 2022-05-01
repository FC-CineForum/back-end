const express = require('express');

const { authValidator } = require('../validators');
const { authController } = require('../controllers');
const { route } = require('express/lib/application');

const router = express.Router();

router.post('/signUp',  
authValidator.signUp, authController.signUp);

router.post('/logIn',  
authValidator.logIn, authController.logIn);

router.get('/verifyAccount',  
authValidator.verifyAccount, authController.verifyAccount);

router.get('/getUser/:token',
authValidator.getUser, authController.getUser);

module.exports = router;