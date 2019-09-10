'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const swagger = require('./src/swagger.js');
const mongooseOptions = {
  useNewUrlParser:true,
  useCreateIndex: true,
};
mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

require('./src/app.js').start(process.env.PORT);
