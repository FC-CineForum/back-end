const jwt = require('jsonwebtoken');
const { 
  JWT_TOKEN_LOGIN,
  JWT_TOKEN_EMAIL,
} = process.env;

const generateTokenLogin = (username, avatar) => {
  try {
    const token = jwt.sign({
      username: username,
      avatar: avatar,      
    }, JWT_TOKEN_LOGIN, { expiresIn: '7d' });
    return token;
  } catch (error) { 
    console.log('Create token failed');
  }
};

const generateTokenEmail = (username, email) => {
  try {
    const token = jwt.sign({
      username: username,
      email: email,
    }, JWT_TOKEN_EMAIL, { expiresIn: '24h' });
    return token;
  } catch (error) {
    console.log('Create token failed');
  }
};

const verifyTokenLogin = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_TOKEN_LOGIN);
    return decoded;
    } catch (error) {
      console.log('Verify token failed');
    }
  };

  const verifyTokenEmail = (token) => {
    try {
      const decoded = jwt.verify(token, JWT_TOKEN_EMAIL);
      return decoded;
    } catch (error) {
      console.log('Verify token failed');
    }
  };

module.exports = {
  generateTokenLogin,
  generateTokenEmail,
  verifyTokenLogin,
  verifyTokenEmail,
}