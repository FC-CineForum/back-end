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
    const exists = await database.query(
      `SELECT * FROM playlist_entry WHERE username = $1 AND list_name = $2 
      AND id_entry = $3`, [username, listName, entryId]);
    if (exists.rowCount === 1) {
      return res.status(401).json({ message: "Entry already is on playlist"})
    }
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
    var result = [];
    var playlist = await database.query(
      `SELECT list_name FROM playlist WHERE username = $1`, [username]);
    if (playlist.rowCount === 0) {
      return res.status(404).json({ message: 'Any playlist not found' });
    }
    for (let i = 0; i < playlist.rows.length; i++) {
      let entry = await database.query(
        `SELECT title, image FROM entry WHERE id_entry IN (SELECT id_entry FROM playlist_entry WHERE list_name = $1)`,
        [playlist.rows[i].list_name]);
      if (entry.rowCount > 0) {
        result.push({
          playlist: playlist.rows[i].list_name,
          image: entry.rows[0].image,
        });
      } else {
        result.push({
          playlist: playlist.rows[i].list_name,
          image: 'S/N',
        });
      }
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log(error)
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