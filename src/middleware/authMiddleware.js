const jwt = require('jsonwebtoken');
const { JWT_TOKEN_LOGIN } = process.env;

const createToken = (user) => {
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

module.exports = {
  createToken,
}