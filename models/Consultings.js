const mongoose = require('mongoose');

const consultingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User',
  },
  customer: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'Customer',
  },
  contents: {
    type: Map,
    of: Array,
    required: true,
  },
});

module.exports = mongoose.model('Consulting', consultingSchema);
