'use strict';

require('dotenv').config();
const SG = require('sentence-generator');
const sG = SG('./words.txt');
const mongoose = require('mongoose');
const swagger = require('./src/swagger.js');
const mongooseOptions = {
  useNewUrlParser:true,
  useCreateIndex: true,
};
mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

require('./src/app.js').start(process.env.PORT);


function testGenerate() {
  return sG.take(1);
}

console.log(testGenerate());