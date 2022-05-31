const express = require('express');

const { userController } = require('../controllers');
const { userValidator } = require('../validators')

const router = express.Router();

router.post('/rating',  
userValidator.rating, userController.rating);

router.post('/reply',  
userValidator.reply, userController.reply);

router.post('/likes',  
userValidator.likes, userController.like);

module.exports = router;