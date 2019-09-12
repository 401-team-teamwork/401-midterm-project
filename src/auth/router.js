'use strict';
/**
 * API Router
 * @module src/router
 */

const express = require('express');
const authRouter = express.Router();

const User = require('./users-model.js');
const auth = require('./middleware.js');

/**
 * Sign up new user
 * @route POST /signup
 * @param {string} username
 * @param {string} password
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( (user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.status(200).send(req.token);
    }).catch(next);
});

/**
 * Sign in an existing user
 * @route POST /signin
 * @param {string} username
 * @param {string} password
 * @param {string} auth token
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
authRouter.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.status(200).send(req.token);

});

/**
 * Sign in an existing and generate permanent key
 * @route POST /key
 * @param {string} username
 * @param {string} password
 * @param {string} auth token
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
authRouter.post('/key', auth, (request, response, next) => {
  let key = request.user.generateToken('key');
  response.status(200).send(key);
});

authRouter.post('/update', auth, (request, response, next) => {
  let record = {};
  record.incorrectEntries = request.body.incorrectEntries;
  record.correctEntries = request.body.correctEntries;
  record.wordsPerMinute = request.body.wordsPerMinute;
  request.user.stats.push(record);
  console.log(request.user._id, request.user);
  User.findByIdAndUpdate(request.user._id, request.user, {new: true})
    .then( result => response.status(200).json(result) )
    .catch( next );

});

module.exports = authRouter;

