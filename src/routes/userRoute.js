const express = require('express');

const { userController } = require('../controllers');
const { userValidator } = require('../validators');

const router = express.Router();

router.post('/rating/:entryId',  
userValidator.rating, userController.rating);

router.post('/reply/:ratingId',  
userValidator.reply, userController.reply);

router.post('/interaction/:ratingId',  
userValidator.likes, userController.like);

router.get('/like/:ratingId/:username', 
userValidator.isLike, userController.isLike);

router.get('/find/', 
//userValidator.find, 
userController.find);

router.delete('/rating/:ratingId',  
userValidator.declassification, userController.declassification);

router.delete('/reply/:replyId',  
userValidator.returnComment, userController.returnComment);

router.delete('/interaction/:ratingId',  
userValidator.dislike, userController.dislike);

module.exports = router;