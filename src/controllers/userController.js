const { database } = require('../../database/config/index');

const rating = async (req, res) => {
  const {
    
  } = req.body;
  try {
    const rating = await database.query(
    `INSERT INTO reply (username, message, date_created, id_rating)
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