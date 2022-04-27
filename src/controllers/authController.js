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

const signUp = async (req, res) => {
  const { 
    username, email, country, birthDate, isPublic, avatar, password, 
    name, lastName
  } = req.body;

  const userExists = await pool.query(
    'SELECT * FROM users WHERE email = $1', [email] 
    );
  if (userExists.rowCount === 0) {
    const hash = await bcrypt.hash(password, 10); 
    await pool.query(`INSERT INTO users 
    (username, email, country, is_public, date_of_birth, 
      avatar, password, name, last_name) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, 
    [username, email, country, isPublic, birthDate, avatar, hash, 
      name, lastName]);
    return res.status(200).json({ 
      message: 'User was created successfully' 
    }); 
  }
  return res.status(401).json({ 
    message: 'The email is already taken!' 
  });
}

const logIn = async (req, res) => {
  const { email, password } = req.body;
  if  (!email || !password) return res.status(401).json({
    message: 'Email and password are required'});
    const user = await pool.query(
      'SELECT * FROM users u WHERE u.email = $1', [email]
    );
    if (user.rowCount !== 1) return res.status(401).json({
      message: 'User not found'
    });
  const isMatch = await bcrypt.compare(password, user.rows[0].password);
  if (isMatch) {
    // req.session.user = {
    //   username: user.rows[0].username,
    //   avatar: user.rows[0].avatar,
    // }
    
    return res.status(200).json({ 
      message: 'User logged in successfully',
      avatar: user.rows[0].avatar,
      username: user.rows[0].username,
      token: 'token'
    });
  }
  return res.status(401).json({
    message: 'Password or email is incorrect'
  });
}

module.exports = {
  signUp,
  logIn,
} 