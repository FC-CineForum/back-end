const express = require('express');

const { playlistController } = require('../controllers');
const { playlistValidator } = require('../validators/index.js')

const router = express.Router();

router.post('/playlist', 
playlistValidator.createPlaylist, playlistController.createPlaylist);

router.get('/playlist/:username',  
playlistValidator.getPlaylist, playlistController.getPlaylist);

router.put('/playlist/',
playlistValidator.addEntry, playlistController.addEntry);

router.get('/playlist/:username/:name',  
playlistValidator.playlist, playlistController.playlist);

module.exports = router;