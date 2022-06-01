const express = require('express');

const { entryController } = require('../controllers');
const { entryValidator } = require('../validators')

const router = express.Router();

router.post('/movies/add',  
entryValidator.addMovie, entryController.addMovie);

router.get('/movies/:id',
entryValidator.getEntry, entryController.getMovie);

router.post('/series/add', 
entryValidator.addSeries, entryController.addSeries);

router.get('/series/:id',
entryValidator.getEntry, entryController.getSeries);

router.post('/episodes/add', 
entryValidator.addEpisode, entryController.addEpisode);

router.get('/entry/latest',
entryController.getLatest);

module.exports = router;