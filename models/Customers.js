const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  consultant: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User',
  },
  consulting: [{
    type: mongoose.ObjectId,
    ref: 'Consulting',
  }],
});

module.exports = mongoose.model('Customer', customerSchema);
