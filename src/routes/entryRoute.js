const express = require('express');

const { entryController } = require('../controllers');
const { entryValidator } = require('../validators')

const router = express.Router();

router.post('/movies/',  
entryValidator.addMovie, entryController.addMovie);

router.post('/series/', 
entryValidator.addSeries, entryController.addSeries);

router.post('/episodes/', 
entryValidator.addEpisode, entryController.addEpisode);

router.get('/entry/:id', 
entryValidator.getEntry, entryController.getEntry);

router.get('/dashboard',
entryController.getLatest);

router.delete('/movies/:id',  
entryValidator.deleteEntry, entryController.deleteMovie);

router.delete('/series/:id', 
entryValidator.deleteEntry, entryController.deleteSeries);

module.exports = router;