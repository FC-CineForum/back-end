const bcrypt = require('bcrypt');
const { authMiddleware } = require('../middleware/');
const { database } = require('../../database/config/index');

const signUp = async (req, res) => {
  const { 
    username, email, country, birthDate, isPublic, avatar, password, 
    name, lastName
  } = req.body;
  const userExists = await database.query(
    'SELECT * FROM users WHERE email = $1', [email] 
    );
  if (userExists.rowCount === 0) { 
    const hash = await bcrypt.hash(password, 10); 
    const token = authMiddleware.generateTokenEmail(username);
    await database.query(`INSERT INTO users 
    (username, email, country, is_public, date_of_birth, 
      avatar, password, name, last_name, token) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, 
    [username, email, country, isPublic, birthDate, avatar, hash, 
      name, lastName, token]);  
    await authMiddleware.sendConfirmationEmail(email, token);
    return res.status(200).json({ 
      message: 'User was created successfully' 
    }); 
  }
  return res.status(401).json({ 
    message: 'The email is already taken!' 
  });
}

const administrator = async (req, res) => {
  const { username } = req.body;
  const userExists = await database.query(
    'SELECT * FROM administrator WHERE username = $1', [username]);
  if (userExists.rowCount === 0) {
    await database.query(`INSERT INTO administrator
    (username) VALUES ($1)`, [username]);
  return res.status(200).json({
    message: `Administrator:${username} was created successfully`
  });
  }
  return res.status(401).json({
    message: 'The username is already taken!'
  });
}

const logIn = async (req, res) => {
  const { email, password } = req.body;
  if  (!email || !password) return res.status(401).json({
    message: 'Email and password are required'
  });
  const user = await database.query(
    'SELECT * FROM users u WHERE u.email = $1', [email]
  );
  if (user.rowCount !== 1) return res.status(401).json({
      message: 'User not found'
  });
  if(!user.rows[0].is_verified) return res.status(401).json({
      message: 'Account not verified'
  });
  const isMatch = await bcrypt.compare(password, user.rows[0].password);
  if (isMatch) {
    const token = authMiddleware.generateTokenLogin(user.rows[0]);  
    return res.status(200).json({ 
      message: 'User logged in successfully',
      username: user.rows[0].username,
      avatar: user.rows[0].avatar,
      token: token
    });
  }
  return res.status(401).json({
    message: 'Password or email is incorrect'
  });
}

const verifyAccount = async (req, res) => { 
  const { token } = req.query;
  try {
    const user = authMiddleware.verifyTokenEmail(token);
    await database.query(
      `UPDATE users SET is_verified = true WHERE username = $1`, 
      [user.username]
    );
    return res.status(200).json({
      message: 'Account verified successfully'
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Token expired'
    });
  }
}

const getUser = async (req, res) => {
  const bearerHeaders = req.headers["authorization"];
  const token = bearerHeaders.split(' ')[1];
  try {
    const user = authMiddleware.verifyTokenLogin(token);
    const userData = await database.query(
      `SELECT * FROM users WHERE username = $1`, 
      [user.username]
    );
    if (userData.rowCount === 1) {
      return res.status(200).json({
        message: 'User data',
        user: user, 
      });
    }
    return res.status(404).json({
      message: 'User not found'
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Token expired'
    });
  }
}

module.exports = {
  signUp,
  administrator,
  logIn,
  verifyAccount,
  getUser,
} 