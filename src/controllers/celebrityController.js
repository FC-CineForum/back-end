const { database } = require('../../database/config/index');

const addCelebrity = async (req, res) => {
  const { name, biography, picture } = req.body;
  try {
    const exists = await database.query(
      'SELECT * FROM celebrity WHERE name = $1', [name]
    );
    if (exists.rowCount !== 0) {
      return res.status(409).json({
        message: 'Celebrity already exists',
      });
    }
    const celebrity = await database.query(
      `INSERT INTO celebrity (name, biography, picture)
      VALUES ($1, $2, $3) RETURNING id_celebrity`, [name, biography, picture]);
    return res.status(200).json({
      message: `${name} added successfully`
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

module.exports = {
  addCelebrity,
}