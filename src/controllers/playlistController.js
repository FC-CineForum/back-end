const { database } = requiere('../../database/config/index');

const addPlaylist = async (req, res) => {
  const {
    listName, username, isPublic, description
  } = req.body;
  try {
    const userExist = await database.query(
      'SELECT * from users WHERE username = $1', [username]
    );
    const playlistExists = await database.query(
      'SELECT * from playlist WHERE list_name = $1', [listName]
    );
    if (userExist.rowCount === 0) {
      return res.status(409).json({
        message: 'User not found'
      });
    }
    if (playlistExists.rowCount !== 0) {
      return res.status(409).json({
        message: 'Playlist already exist'
      });
    }
    await database.query(
      `INSERT INTO playlist 
      (list_name, username, is_public, description) 
      VALUES ($1, $2, $3, $4)`,
      [listName, username, isPublic, description]
    );
    return res.status(200).json({
      message: 'Playlist was created successfully'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
}

const addEntryToPlaylist = async (req, res) => {
  const { idEntry, listName, username } = req.body;
  try { 
    const userExist = await database.query(
      'SELECT * from users WHERE username = $1', [username]
    );
    const playlistExists = await database.query(
      'SELECT * from playlist WHERE list_name = $1', [listName]
    );
    const entryExists = await database.query(
      'SELECT * from entry WHERE id_entry = $1', [idEntry]
    );
    if (userExist.rowCount === 0) {
      return res.status(409).json({
        message: 'User not found'
      });
    }
    if (playlistExists.rowCount === 0) {
      return res.status(409).json({
        message: 'Playlist not found'
      });
    }
    if (entryExists.rowCount === 0) {
      return res.status(409).json({
        message: 'Entry not found'
      });
    }
    await database.query(
      `INSERT INTO playlist_entry 
      (id_entry, list_name, username)
      VALUES ($1, $2, $3)`, [idEntry, listName, username]
    );
    return res.status(200).json({
      message: 'Entry added successfully to playlist'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
}

const getUserPlaylists = async (req, res) => {
  const { username } = req.body;
  try {
    const userExists = await database.query(
      'SELECT * FROM users WHERE username = $1', [username]
    );
    if (userExists.rowCount === 0) {
      return res.status(409).json({
        message: 'User not found'
      });
    }
    const userPlaylists = await database.query(
      'SELECT * FROM playlists WHERE username = $1', [username]
    );
    const playlistEntries = await database.query(
      'SELECT * FROM playlist_entry WHERE username = $1', [username]
    )
    return res.status(200).json(
      userPlaylists.rows.reduce((acc, l) => {
        ...acc,
        [l.list_name]: playlistEntries.rows.filter(e => e.list_name === l.list_name),
      }, {})
    );
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
}