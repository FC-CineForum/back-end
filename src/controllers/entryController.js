const { database } = require('../../database/config/index');

const addMovie = async (req, res) => {
  const {
    title, synopsis, image, release, classification, type, trailer,length,
  } = req.body;
  try {
    const exists = await database.query(
      'SELECT * FROM entry WHERE title = $1', [title]
    );
    if (exists.rowCount !== 0) {
      return res.status(409).json({
        message: 'Entry already exists',
      });
    }
    const movie = await database.query(
    `INSERT INTO entry (title, synopsis, image, release, classification, type)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_entry`,
      [title, synopsis, image, release, classification, type]
    );
    const id = movie.rows[0].id_entry;
    await database.query(
      `INSERT INTO movie (id_movie, trailer, length) VALUES ($1, $2, $3)`,
      [id, trailer, length]);
    return res.status(200).json({
      message: 'Movie added successfully',
      entryId: id,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });  
  }
};

const addSeries = async (req, res) => {
  const {
    title, synopsis, image, release, classification, type, 
    trailer,
  } = req.body;
  try {
    const exists = await database.query(
      'SELECT * FROM entry WHERE title = $1', [title]
    );
    if (exists.rowCount !== 0) {
      return res.status(409).json({
        message: 'Series is already in the database',
      });
    }
    const series = await database.query(
      `INSERT INTO entry (title, synopsis, image, release, classification, type)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_entry`,
      [title, synopsis, image, release, classification, type]
    );
    const id = series.rows[0].id_entry;
    await database.query(
    `INSERT INTO series (id_series, trailer) VALUES ($1, $2)`, [id, trailer]);
    return res.status(200).json({
      message: 'Series added successfully',
      entryId: id,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });  
  }
};

const addEpisode = async (req, res) => {
  const { 
    idSeries, title, synopsis, image, release, classification, type, season, 
    noEp, length } = req.body;
  try {
    const episode = await database.query(
      `INSERT INTO entry (title, synopsis, image, release, classification, type)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_entry`,
      [title, synopsis, image, release, classification, type]
    );
    const id = episode.rows[0].id_entry;
    await database.query(
      `INSERT INTO episode (id_episode, id_series, season, no_ep, length)
      VALUES ($1, $2, $3, $4, $5)`, [id, idSeries, season, noEp, length]);
    return res.status(200).json({
      message: 'Episode added successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error 
    });  
  }
};

getEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await database.query(
      'SELECT * FROM entry WHERE id_entry = $1', [id]);
    let entryInfo;
    switch (entry.rows[0].type) {
      case 'm':
        entryInfo = await database.query(
          'SELECT * FROM movie WHERE id_movie = $1', [id]);
        break;
      case 's':
        entryInfo = await database.query(
          'SELECT * FROM series WHERE id_series = $1', [id]);
        break;
      case 'e':
        entryInfo = await database.query(
          'SELECT * FROM episode WHERE id_episode = $1', [id]);
        break;
      default:
        return res.status(404).json({  
          message: 'Entry not found',
        });
    }
    const rating = await database.query(
      `SELECT AVG(stars) FROM rating WHERE id_entry = $1`, [id]);
    const comments = await database.query(
      'SELECT * FROM rating WHERE id_entry = $1', [id]);
    let replies = [];  
    for (let i=0; i < comments.rowCount; i++) {
      const reply = await database.query(
        'SELECT * FROM reply WHERE id_rating = $1', [comments.rows[i].id_rating] 
      );
      replies.push({
        //replyId: reply.rows[i].id_reply,
        //ratingId: reply.rows[i].id_rating,
        username: reply.rows[i].username,
        message: reply.rows[i].message,
        date: reply.rows[i].date_created,
      });
    }
    return res.status(200).json({
      title: entry.rows[0].title,
      synopsis: entry.rows[0].synopsis,
      image: entry.rows[0].image,
      release: entry.rows[0].release,
      classification: entry.rows[0].classification,
      type: entry.rows[0].type,
      rating: parseFloat(rating.rows[0].avg),
      trailer: entryInfo.rows[0].trailer,
      length: entryInfo.rows[0].length,
      replies: replies,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

getLatest = async (_, res) => {
  try {
    const latest = await database.query(`SELECT * FROM last_inserted_entry`);
    let dashboard = [];
    for (let i = 0; i < latest.rowCount; i++) {
      let entry;
      if(latest.rows[i].type === 'm') {
        entry = await database.query(
          'SELECT * FROM entry WHERE id_entry = $1', [latest.rows[i].id_entry]);
        const movie = await database.query(
          'SELECT * FROM movie WHERE id_movie = $1', [latest.rows[i].id_entry]);
        dashboard.push({
          id: entry.rows[0].id_entry,
          title: entry.rows[0].title,
          synopsis: entry.rows[0].synopsis,
          image: entry.rows[0].image,
          release: entry.rows[0].release,
          classification: entry.rows[0].classification,
          type: entry.rows[0].type,
          trailer: movie.rows[0].trailer,
          length: movie.rows[0].length,
        }); 
      } 
      if (latest.rows[i].type === 's') {
        entry = await database.query(
          'SELECT * FROM entry WHERE id_entry = $1', [latest.rows[i].id_entry]);
        const series = await database.query(
          'SELECT * FROM series WHERE id_series = $1', [latest.rows[i].id_entry]);
        dashboard.push({
          id: entry.rows[0].id_entry,
          title: entry.rows[0].title,
          synopsis: entry.rows[0].synopsis,
          image: entry.rows[0].image,
          release: entry.rows[0].release,
          classification: entry.rows[0].classification,
          type: entry.rows[0].type,
          trailer: series.rows[0].trailer,
        });
      }
    }
    return res.status(200).json(dashboard);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    await database.query(
      'DELETE FROM movie WHERE id_movie = $1 RETURNING id_movie', [id]);
    return res.status(200).json({
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

deleteSeries = async (req, res) => {
  const { id } = req.params;
  try {
    const series = await database.query(
      'DELETE FROM series WHERE id_series = $1 RETURNING id_series', [id]);
    return res.status(200).json({
      message: 'Series deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

module.exports = {
  addMovie,
  addSeries,
  addEpisode,
  getEntry,
  getLatest,
  deleteMovie,
  deleteSeries,
};