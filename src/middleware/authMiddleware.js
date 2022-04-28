const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { 
  JWT_TOKEN_LOGIN,
  JWT_TOKEN_EMAIL,
  EMAIL_PASSWORD,
  FRONT_URL
} = process.env;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'cineforum.noreply@gmail.com',
    pass: `${EMAIL_PASSWORD}`,
  },
});

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

const generateTokenEmail = (username) => {
  try {
    const token = jwt.sign({
      username: username,
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

const sendConfirmationEmail =  async(email, token) => {
  try {
    transporter.sendMail({
      from: `Verify account <noreply@cineforum.com>`,
      to: email,
      subject: 'Verify your account',
      html: `<p>Please click on the link below to verify your account</p>
      <a href="http://localhost:3000/verifyAccount/${token}">
      http://localhost:3000/verifyAccount/${token}</a>`,
    });
    } catch (error) {
      console.log('Send confirmation email failed');
    }
  };

module.exports = {
  generateTokenLogin,
  generateTokenEmail,
  verifyTokenLogin,
  verifyTokenEmail,
  sendConfirmationEmail,
}