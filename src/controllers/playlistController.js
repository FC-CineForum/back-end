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
      return res.status(404).json({ message: 'Playlist not found' });
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
    return res.status(500).json({ 
      error: 'Internal server error', error
    });
  }
};

const playlist = async (req, res) => {
  const { username, name } = req.params;
  try{
    var info = [];
    let playlistInfo = await database.query(
      'SELECT * FROM playlist_entry WHERE username = $1 AND list_name = $2',
      [username, name]);
    for (let i = 0; i < playlistInfo.rowCount; i++) {
      let entryInfo = await database.query(
        'SELECT * FROM entry WHERE id_entry = $1', [playlistInfo.rows[i].id_entry]);
      if(entryInfo.rows[0].type === 'm') {
        entry = await database.query(
          'SELECT * FROM entry WHERE id_entry = $1', [playlistInfo.rows[i].id_entry]);
        const movie = await database.query(
          'SELECT * FROM movie WHERE id_movie = $1', [playlistInfo.rows[i].id_entry]);
        const rating = await database.query(
          'SELECT AVG(stars) FROM rating WHERE id_entry = $1', 
          [playlistInfo.rows[i].id_entry]); 
        info.push({
          id: entry.rows[0].id_entry,
          title: entry.rows[0].title,
          synopsis: entry.rows[0].synopsis,
          image: entry.rows[0].image,
          release: entry.rows[0].release,
          classification: entry.rows[0].classification,
          type: entry.rows[0].type,
          trailer: movie.rows[0].trailer,
          length: movie.rows[0].length,
          rating: rating.rows[0].avg === null ? '0' : rating.rows[0].avg.substring(0, 4),
        }); 
        console.log(info);
      } 
      if (entryInfo.rows[0].type === 's') {
        entry = await database.query(
          'SELECT * FROM entry WHERE id_entry = $1', [playlistInfo.rows[i].id_entry]);
          const series = await database.query(
          'SELECT * FROM series WHERE id_series = $1', [playlistInfo.rows[i].id_entry]);
          const rating = await database.query(
            'SELECT AVG(stars) FROM rating WHERE id_entry = $1', 
            [playlistInfo.rows[i].id_entry]);   
            console.log(rating);  
        info.push({
          id: entry.rows[0].id_entry,
          title: entry.rows[0].title,
          synopsis: entry.rows[0].synopsis,
          image: entry.rows[0].image,
          release: entry.rows[0].release,
          classification: entry.rows[0].classification,
          type: entry.rows[0].type,
          trailer: series.rows[0].trailer,
          rating: rating.rows[0].avg === null ? '0' : rating.rows[0].avg.substring(0, 4),
        });
      }
    }
    return res.status(200).json(info);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Internal server error', error
    });
  }
} 

module.exports = {
  createPlaylist,
  addEntry,
  getPlaylist,
  playlist,
}