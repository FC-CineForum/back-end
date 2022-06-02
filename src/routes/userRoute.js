const express = require('express');

const { userController } = require('../controllers');
const { userValidator } = require('../validators')

const router = express.Router();

router.post('/rating/:entryId',  
userValidator.rating, userController.rating);

router.post('/reply/:ratingId',  
userValidator.reply, userController.reply);

router.post('/like/:replyId',  
userValidator.likes, userController.like);

module.exports = router;