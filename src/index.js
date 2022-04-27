require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const app = express();

const { PORT } = process.env;

app.listen(PORT);
console.log('Server is running on port:', PORT);

app.use(morgan('dev'));
app.use(helmet()); 
app.use(
  cors({
    origin: "http://localhost:8084",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: `${process.env.COOKIE_SECRET}`,
    credentials: true,
    name: 'session',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.ENV === 'PRODUCTION',
      httpOnly: true,
      sameSite: process.env.ENV === 'PRODUCTION' ? 'none' : 'lax',
     },
  })
);

app.get('/', (_, res) => {
  res.send('Cine-Forum Backend is running!');
});

app.use('/cineforum', require('./routes'));

module.exports = { app, PORT };