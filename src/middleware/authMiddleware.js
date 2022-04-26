const jwt = require('jsonwebtoken');
const { 
  JWT_TOKEN_LOGIN,
  JWT_TOKEN_EMAIL,
} = process.env;

const createTokenLogin = (user) => {
  try {
    const token = jwt.sign({
      username: user.username,
      avatar: user.avatar,      
    }, JWT_TOKEN_LOGIN, { expiresIn: '24h' });
    return token;
  } catch (error) {
    return res.status(400).json({ 
      message: 'Create token failed' 
    }); 
  }
};

const createTokenEmail = (user) => {
  try {
    const token = jwt.sign({
      username: user.username,
      email: user.email,
    }, JWT_TOKEN_EMAIL, { expiresIn: '48h' });
    return token;
  } catch (error) {
    return res.status(400).json({ 
      message: 'Create token failed' 
    }); 
  }
};

module.exports = {
  createTokenLogin,
  createTokenEmail,
}