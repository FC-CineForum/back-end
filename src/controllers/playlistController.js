const { database } = require('../../database/config/index');

const createPlaylist = async (req, res) => {
  const { listName, username, isPublic, description } = req.body;
  try {
    await database.query(
      'INSERT INTO playlist (list_name, username, is_public, description) VALUES ($1, $2, $3, $4)', 
      [listName, username, isPublic, description]);
    return res.status(200).json({
      message: 'Playlist created'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

const addEntry = async (req, res) => {
  const { entryId, username, listName } = req.body;
  try {
    await database.query(
      `INSERT INTO playlist_entry (id_entry, list_name, username) 
      VALUES ($1, $2, $3)`, [entryId, listName, username]);
    return res.status(200).json({
      message: 'Entry added to playlist'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

const getPlaylist = async (req, res) => {
  const { username } = req.params;
  try {
    const playlist = await database.query(
      'SELECT list_name, is_public FROM playlist WHERE username = $1', [username]);
      console.log(playlist.rows);
    return res.status(200).json({
      playlist: [playlist.rows],
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Internal server error', error
    });
  }
};

module.exports = {
  createPlaylist,
  addEntry,
  getPlaylist,
}