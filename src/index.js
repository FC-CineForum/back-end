require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

const { PORT } = process.env;

app.listen(PORT);
console.log('Server is running on port:', PORT);

app.use(morgan('dev'));
app.use(helmet()); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  res.send('Cine-Forum Backend is running!');
});

app.use('/cineforum', require('./routes'));

module.exports = { app, PORT};