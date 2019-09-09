'use strict';

/**
 * add rout param to request body
 * @param {req}
 * @param {res}
 * @param {next}
 *
 */
module.exports = (request, response, next) => {
  const modelName = request.params.model;
  if(modelName === 'categories' || modelName === 'products'){
    const Model = require(`../models/${modelName}/model.js`);
    request.model = new Model();
    next();
  } else {
    response.send('Model not recognized');
  }

};