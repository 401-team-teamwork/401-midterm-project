const express = require('express');
const router = express.Router();

const Products = require('../models/products/products');
const products = new Products();

router.get('/', getProducts);
router.post('/', postProducts);
router.get('/:id', getProduct);
router.put('/:id', putProducts);
router.delete('/:id', deleteProducts);

/**
 * gets all the products in the database
 * @param request
 * @param response
 * @param next
 * @returns
 */
function getProducts(request,response,next) {
  // expects an array of objects back
  products.get()
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
 * gets a product
 * @param request
 * @param response
 * @param next
 * @returns
 */
function getProduct(request,response,next) {
  // expects an array with one object in it
  products.get(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 * creates a product
 * @param request
 * @param response
 * @param next
 * @returns
 */
function postProducts(request,response,next) {
  // expects the record that was just added to the database
  products.create(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 * Updates a product
 * @param request
 * @param response
 * @param next
 * @returns
 */
function putProducts(request,response,next) {
  // expects the record that was just updated in the database
  products.update(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 * Deletes a product
 * @param request
 * @param response
 * @param next
 * @returns
 */
function deleteProducts(request,response,next) {
  // Expects no return value (the resource should be gone)
  products.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = router;