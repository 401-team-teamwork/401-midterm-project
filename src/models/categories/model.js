'use strict';

const Model = require('../mongo.js');
const schema = require('./categories-schema.js');

// How can we connect ourselves to the mongo interface?
class Categories extends Model {

  constructor(){
    super(schema);
  }

}

// What do we export?
module.exports = Categories;