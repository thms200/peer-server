require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const createError = require('http-errors');
const { ERROR } = require('./constants');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { pingTimeout: 5000 });
require('./config/socket')(io);

app.use(cors());

mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to Mongo database..'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/users', require('./routes/users'));
app.use('/api/customers', require('./routes/customers'));
app.use('/static', express.static(__dirname + '/public'));
app.use('/', (req, res) => {
  res.send('connect!!!!');
});

server.listen(process.env.PORT, () => console.log('server connection..'));

app.use((req, res, next) => {
  next(createError(404), ERROR.INVALID_URL);
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  const errMessage = err.message || ERROR.GENERAL_ERROR;
  res.send({ errMessage });
});

module.exports = app;
