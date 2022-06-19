const { database } = require('../../database/config/index');

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
  const { name } = req.body;
  try {
    const title = await database.query(
      `SELECT id_entry, title, type FROM entry WHERE title ILIKE '%${name}%'`, []);
    if (title.rowCount === 0) {
      return res.status(200).json({ message: 'No results' });
    }
    var entryInfo, response;
      if (title.rows[0].type === 'm') {
        entryInfo = await database.query(
          'SELECT trailer, length FROM movie WHERE id_movie = $1', [title.rows[0].id_entry]);
          response = {
            movie: entryInfo.rows[0],
            entry: title.rows[0],
          };
      } else if (title.rows[0].type === 's') {
        entryInfo = await database.query(
          'SELECT trailer FROM series WHERE id_series = $1', [title.rows[0].id_entry]); 
          let noEpisodes = await database.query(
            'SELECT COUNT(*) FROM episode WHERE id_series = $1', [title.rows[0].id_entry]);
          response = {
            series: entryInfo.rows[0],
            entry: title.rows[0],
            noEpisodes: noEpisodes.rows[0].count,
          };
        }    
        const rating = await database.query(
          'SELECT AVG(stars) FROM rating WHERE id_entry = $1', [title.rows[0].id_entry]);
          let ratings = [];  
        let comments = await database.query(
          'SELECT * FROM rating WHERE id_entry = $1', [title.rows[0].id_entry]);
        for (let i=0; i < comments.rowCount; i++) {
          let reply = await database.query(
            'SELECT username, message FROM reply WHERE id_rating = $1', 
            [comments.rows[i].id_rating]);
          ratings.push({
            ratingId: comments.rows[i].id_rating,
            username: comments.rows[i].username,
            stars: comments.rows[i].stars,
            message: comments.rows[i].message,
            replies: reply.rows,
          });
        }
        let castRole = await database.query(
          'SELECT id_celebrity, role FROM roles WHERE id_entry = $1', [title.rows[0].id_entry]);
          let cast = [];
        for (let i=0; i < castRole.rowCount; i++) {
          let celebrity = await database.query(
            'SELECT * FROM celebrity WHERE id_celebrity = $1', 
            [castRole.rows[0].id_celebrity]);
          cast.push({
            name: celebrity.rows[0].name,
            role: castRole.rows[i].role,
            picture: celebrity.rows[0].picture,
          });
        }    
      response.rating = rating.rows[0].avg === null ? '0' : rating.rows[0].avg.substring(0, 4),
      response.ratings = ratings;
      response.cast = cast;
      return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
}

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