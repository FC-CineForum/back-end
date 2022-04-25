const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
  database: 'cineforum',
  port: 5432
})

const signUp = async (req, res) => {
  const { 
    userName, email, country, birthDate, isPublic, avatar, password, 
    name, lastName
  } = req.body;

  const userExists = await pool.query(
    'SELECT * FROM users WHERE email = $1', [email] 
    );
  if (userExists.rowCount === 0) {
    const hash = await bcrypt.hash(password, 10); 
    const newUser = await pool.query(`INSERT INTO users 
    (userName, email, country, is_public, date_of_birth, 
      avatar, password, name, last_name) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, 
    [userName, email, country, isPublic, birthDate, avatar, hash, 
      name, lastName]);
    return res.status(200).json({ 
      Message: 'User was created successfully' 
    }); 
  }
  return res.status(401).json({ 
    Message: 'The email is already taken!' 
  });
}

const logIn = async (req, res) => {
  const { email, password } = req.body;
  if  (!email || !password) return res.status(401).json({
    Message: 'Email and password are required'});
    const user = await pool.query(
      'SELECT * FROM users u WHERE u.email = $1', [email]
    );
    if (user.rowCount !== 1) return res.status(401).json({
      Message: 'User not found'
    });
  const isMatch = await bcrypt.compare(password, user.rows[0].password);
  if (isMatch) {
    return res.status(200).json({ 
      userName: user.rows[0].userName,
      avatar: user.rows[0].avatar
    });
  }
  return res.status(401).json({
    Message: 'Password or email is incorrect'
  });
}
 
module.exports = {
  signUp,
  logIn,
} 