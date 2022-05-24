const express = require('express');

const { entryController } = require('../controllers');
const { entryValidator } = require('../validators')

const router = express.Router();

router.post('/movies/add',  
entryValidator.addMovie, entryController.addMovie);

router.post('/series/add', 
entryValidator.addSeries, entryController.addSeries);

router.post('/episodes/add', 
entryValidator.addEpisode, entryController.addEpisode);

module.exports = router;