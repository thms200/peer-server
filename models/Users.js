const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  picture_url: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
