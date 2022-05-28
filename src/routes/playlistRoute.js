const express = require('express');

const { playlistController } = require('../controllers');
const { playlistValidator }  = require('../validators');

const router = express.Router();

router.post('/playlists/add',
playlistValidator.addPlaylist, playlistcontroller.addPlaylist);

router.post('/playlists/entries/add',
playlistValidator.addEntryToPlaylist, playlistController.addEntryToPlaylist);

module.exports = router;
