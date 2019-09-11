'use strict';
const mongoose = require('mongoose');


//created another schema for the stats to reference with the users schema in order populate
const statsSchema = new mongoose.Schema({
  content: String,
  stats:   {
    WPM: {type: Number},
    Errors: {type:Number},
    Correct: {type:Number},
  }});


module.exports = mongoose.model('stats', statsSchema);