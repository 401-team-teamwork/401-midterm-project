'use strict';

const mongoose = require('mongoose');

// What fields and constraints do we want?
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model('products', productSchema);