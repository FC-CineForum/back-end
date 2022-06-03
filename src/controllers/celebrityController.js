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
      message: `${name} added successfully`,
      celebrityId: celebrity.rows[0].id_celebrity,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
}; 

const addRole = async (req, res) => {
  const { celebrityId, entryId }  = req.params;
  const { role } = req.body;
  try {
    await database.query(
      'INSERT INTO roles (id_celebrity, id_entry, role) VALUES ($1, $2, $3)',
      [celebrityId, entryId, role]);
    return res.status(200).json({
      message: `${role} added successfully`
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error', error
    });
  }
};

module.exports = {
  addCelebrity,
  addRole,
}