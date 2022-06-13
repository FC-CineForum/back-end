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
  const { replyId } = req.params;
  const { username, isLike } = req.body;
  try {
    await database.query(
      'INSERT INTO likes (username, id_reply, is_like) VALUES ($1, $2, $3)',
      [username, replyId, isLike]);
    console.log(like);
    return res.status(200).json({
      message: `Like ${isLike}`,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

const isLike = async (req, res) => {
  const { replyId, username } = req.params;
  try {
    const isLike = await database.query(
      'SELECT is_like FROM likes WHERE id_reply = $1 AND username = $2',
      [replyId, username]);
    return !isLike.rows[0] ? res.status(200).json({ message: false }) :
    res.status(200).json({ message: true });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
}

const dislike = async (req, res) => {
  const { replyId } = req.params;
  try {
    await database.query(
      'DELETE FROM likes WHERE id_reply = $1', [replyId]);
    return res.status(200).json({
      message: 'Like deleted'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

module.exports = {
  rating,
  declassification,
  reply,
  like,
  isLike,
  returnComment,
  dislike,
};