require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

const { PORT } = process.env;

app.listen(PORT);
console.log('Server is running on port:', PORT);

app.use(morgan('dev'));
app.use(helmet()); 

const whitelist = [
  'http://localhost:3000', 
  'http://localhost:8081',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
      console.log(origin);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  res.send('Cine-Forum Backend is running!');
});

app.use('/cineforum', require('../routes'));


module.exports = { app };