const { database } = require('../../database/config/index');

const rating = async (req, res) => {
  const {
    idEntry, username, stars, message
  } = req.body;
  try {
    const rating = await database.query(
    `INSERT INTO rating (id_entry, username, stars, message)
      VALUES ($1, $2, $3, $4) RETURNING id_rating`,
      [idEntry, username, stars, message]
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

const reply = async (req, res) => {
  const { idRating, username, message } = req.body;
  try {
    const reply = await database.query(
      `INSERT INTO reply (id_rating, username, message)
      VALUES ($1, $2, $3) RETURNING id_reply`, [idRating, username, message]
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

const like = async (req, res) => {
  const { username, idReply, isLike } = req.body;
  try {
    console.log(req.body);
    await database.query(
      'INSERT INTO likes (username, id_reply, is_like) VALUES ($1, $2, $3)',
      [username, idReply, isLike]);
    return res.status(200).json({
      message: `Like ${isLike}`,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

module.exports = {
  rating,
  reply,
  like,
};