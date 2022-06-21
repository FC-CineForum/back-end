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

router.post('/admin',
authValidator.admin, authController.setAdmin);

router.delete('/admin',
authValidator.admin, authController.deleteAdmin);

router.delete('/user', 
authValidator.username, authController.deleteUser);

module.exports = router;