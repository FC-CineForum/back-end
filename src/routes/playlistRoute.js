const express = require('express');

const { playlistValidator } = require('../validators');
const { playlistController } = require('../controllers');

const router = express.Router();

router.post('/playlists/add',
playlistValidator.addPlaylist, playlistController.addPlaylist);

router.post('/playlists/entries/add',
playlistValidator.addEntryToPlaylist, playlistController.addEntryToPlaylist);

module.exports = router;
