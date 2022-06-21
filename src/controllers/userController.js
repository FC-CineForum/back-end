const { database } = require('../../database/config/index');
const { classification } = require('../utils/validators');

const rating = async (req, res) => {
  const { entryId } = req.params;
  const { username, stars, message } = req.body;
  try {
    const rating = await database.query(
    `INSERT INTO rating (id_entry, username, stars, message)
      VALUES ($1, $2, $3, $4) RETURNING id_rating`,
      [entryId, username, stars, message]
    );
    const id = rating.rows[0].id_rating;
    if (!id) return res.status(400).json({ message: 'Missing rating' });
    return res.status(200).json({
      message: `Rating id: ${id}`,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });  
  }
}; 

const declassification = async (req, res) => {
  const { ratingId } = req.params;
  try {
    await database.query(
      'DELETE FROM rating WHERE id_rating = $1', [ratingId]);
    return res.status(200).json({
      message: 'Rating deleted successfully'});
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

const reply = async (req, res) => {
  const { ratingId } = req.params;
  const { username, message } = req.body;
  try {
    const reply = await database.query(
      `INSERT INTO reply (id_rating, username, message)
      VALUES ($1, $2, $3) RETURNING id_reply`, [ratingId, username, message]
    );
    const id = reply.rows[0].id_reply;
    if (!id) return res.status(400).json({ message: 'Missing reply' });
    return res.status(200).json({
      message: `Reply id: ${id}`,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  } 
};

const returnComment = async (req, res) => {
  const { replyId } = req.params;
  try {
    await database.query(
      'DELETE FROM reply WHERE id_reply = $1', [replyId]);
    return res.status(200).json({
      message: 'Reply deleted successfully'});
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

const like = async (req, res) => {
  const { ratingId } = req.params;
  var { username, isLike } = req.body;
  try {
    const exist = await database.query(
      'SELECT * FROM likes WHERE id_rating = $1 AND username = $2',
      [ratingId, username]);
    if (exist.rowCount === 0) {
    await database.query(
      'INSERT INTO likes (username, id_rating, is_like) VALUES ($1, $2, $3)',
      [username, ratingId, isLike]);
    } else {
      await database.query(
        'UPDATE likes SET is_like = $1 WHERE id_rating = $2 AND username = $3',
        [isLike, ratingId, username]);
    }
    return res.status(200).json({
      message: `Interaction: like is ${isLike}`,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

const isLike = async (req, res) => {
  const { ratingId, username } = req.params;
  try {
    const like = await database.query(
      'SELECT is_like FROM likes WHERE id_rating = $1 AND username = $2',
      [ratingId, username]);
    return like.rowCount === 0 ? res.status(200).json({ message: "missing interaction" }) :
    res.status(200).json({ message: `like is ${like.rows[0].is_like}` });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  } 
};

const dislike = async (req, res) => {
  const { ratingId } = req.params;
  const { username } = req.body;
  try {
    await database.query(
      'DELETE FROM likes WHERE id_rating = $1 AND username = $2', 
      [ratingId, username]);
    return res.status(200).json({
      message: 'Interaction was deleted'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

const find = async (req, res) => {
  const { name } = req.params;  
  try {
    var final = [];
    const entry = await database.query(
      `SELECT * FROM entry WHERE title ILIKE '%${name}%'`, []);
    for (let i = 0; i < entry.rowCount; i++) {
      let rating = await database.query(
        'SELECT AVG(stars) FROM rating WHERE id_entry = $1', [entry.rows[i].id_entry]);
      if (entry.rows[i].type === 'm') {
        let movie = await database.query(
          'SELECT trailer, length FROM movie WHERE id_movie = $1', [entry.rows[i].id_entry]);    
        final.push({
          type: 'm',
          id: entry.rows[i].id_entry,
          title: entry.rows[i].title,
          synopsis: entry.rows[i].synopsis, 
          image: entry.rows[i].image,
          release: entry.rows[i].release,
          classification: entry.rows[i].classification,
          trailer: movie.rows[0].trailer,
          length: movie.rows[0].length,
          rating: rating.rows[0].avg === null ? '0' : rating.rows[0].avg.substring(0, 4),
        });
      } else if (entry.rows[i].type === 's') {
        let series = await database.query(
          'SELECT trailer FROM series WHERE id_series = $1', [entry.rows[i].id_entry]);
        let noEpisodes = await database.query(
          'SELECT COUNT(*) FROM episode WHERE id_series = $1', [entry.rows[i].id_entry]);        
        console.log(noEpisodes)
        final.push({
          type: 's',
          id: entry.rows[i].id_entry,
          title: entry.rows[i].title,
          synopsis: entry.rows[i].synopsis,
          image: entry.rows[i].image,
          release: entry.rows[i].release,
          classification: entry.rows[i].classification,
          trailer: series.rows[0].trailer,
          noEpisodes: noEpisodes.rows[0].count,
          rating: rating.rows[0].avg === null ? '0' : rating.rows[0].avg.substring(0, 4),
        });
      }
    }
    return res.status(200).json(final);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error});
  }
};

module.exports = {
  rating,
  declassification,
  reply,
  returnComment,
  like,
  isLike,
  dislike,
  find,
};