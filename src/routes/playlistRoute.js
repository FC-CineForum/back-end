const express = require('express');

const { entryController } = require('../controllers');
const { entryValidator } = require('../validators')

const router = express.Router();

router.post('/playlists/add',  
playlistValidator.addPlaylist, playlistcontroller.addPlaylist);

router.post('/playlists/entries/add', 
playlistValidator.addEntryToPlaylist, playlistController.addEntryToPlaylist);

module.exports = router;
