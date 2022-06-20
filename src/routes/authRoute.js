const express = require('express');

const { authValidator } = require('../validators/index.js');
const { authController } = require('../controllers');

const router = express.Router();

router.post('/signUp',  
authValidator.signUp, authController.signUp); 

router.post('/logIn',  
authValidator.logIn, authController.logIn);

router.get('/verifyAccount', 
authValidator.verifyAccount, authController.verifyAccount);

router.get('/getUser/',
authValidator.getUser, authController.getUser);

router.post('/admin/:username',
authValidator.admin, authController.setAdmin);

//router.delete('/admin/:username',
//authValidator.admin, authController.deleteAdmin);

module.exports = router;