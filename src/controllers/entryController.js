const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { authMiddleware } = require('../middleware/');
const { DB_PASSWORD } = process.env;

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: `${DB_PASSWORD}`,
  database: 'cineforum',
  port: 5432
});

const addMovie = (req, res) => {
  const {
    link, image, synopsis, title, release, classification, type, length,
  } = req.body;
  const exists = pool.query(
    'SELECT * FROM movies WHERE title = $1', [title]
  );
  if (exists.rowCount === 0) {
    await pool.query(
      `INSERT INTO movies 
      (link, image, synopsis, title, release, classification, type, length) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [link, image, synopsis, title, release, classification, type, length]
    );
    return res.status(200).json({
      message: 'Movie added successfully',
    });
  }
  return res.status(409).json({
    message: 'Movie already exists',
  });
}

module.exports = {
  addMovie,
};
