const express = require('express');
const router = express.Router();
const auth = require('../auth/middleware');

const modelLoader = require('../middleware/model-loader');

router.param('model', modelLoader);

/**
 * This function gets all the objects
 * @route GET /api/v1/:model
 * @param {string} model.query.required - model name required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/api/v1/:model', handleGetAll);
/**
 * Create an object
 * @route POST /api/v1/:model
 * @param {string} model name required
 * @body  {object}
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.post('/api/v1/:model', auth, handleCreate);
/**
 * Get an object
 * @route GET /api/v1/:model/:id
 * @param {string} model name required
 * @param {id} item id required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/api/v1/:model/:id', auth, handleGetOne);
/**
 * Get an object
 * @route PUT /api/v1/:model/:id
 * @param {string} model name required
 * @param {id} item id required
 * @body  {object}
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.put('/api/v1/:model/:id', auth, handleUpdate);
/**
 * Get an object
 * @route DELETE /api/v1/:model/:id
 * @param {string} model name required
 * @param {id} item id required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.delete('/api/v1/:model/:id', auth, handleDelete);

// ROUTE HANDLER FUNCTIONS

/**
 * This function gets all the objects
 * @param {request} request object
 * @param {response} response object
 * @param {next} next function
 * @returns
 */
function handleGetAll(request,response,next) {
  // expects an array of object to be returned from the model
  request.model.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

/**
 * Retrieves all the categories in the database
 * @param {request} request object
 * @param {response} response object
 * @param {next} next function
 * @returns
 */
function handleGetOne(request,response,next) {
  // expects an array with the one matching record from the model
  request.model.get(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 * Creates a category
 * @param {request} request object
 * @param {response} response object
 * @param {next} next function
 * @returns
 */
function handleCreate(request,response,next) {
  // expects the record that was just added to the database
  request.model.create(request.body)
    .then( result => {
      response.status(200).json(result);
    } )
    .catch( next );
}

/**
 * Updates a category
 * @param {request} request object
 * @param {response} response object
 * @param {next} next function
 * @returns
 */
function handleUpdate(request,response,next) {
  // expects the record that was just updated in the database
  request.model.update(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 * Deletes a category
 * @param {request} request object
 * @param {response} response object
 * @param {next} next function
 * @returns
 */
function handleDelete(request,response,next) {
  // Expects no return value (resource was deleted)
  request.model.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = router;