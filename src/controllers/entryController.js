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
    const result = await database.query(
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
      `SELECT * FROM entry e, series, movie WHERE e.id_entry = $1`, [id]);
    return res.status(200).json(entry.rows[0]);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

getLatest = async (_, res) => {
  try {
    const latest = await database.query(
      `SELECT * FROM entry e INNER JOIN series s ON e.id_entry = s.id_series
      WHERE e.id_entry = $1`, [id]);
    return res.status(200).json({
      latest: latest.rows[0],
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
};


