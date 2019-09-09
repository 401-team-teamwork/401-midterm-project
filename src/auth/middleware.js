'use strict';

/**
 * Authentication Middleware
 * @module src/auth/middleware
 */

const User = require('./users-model.js');

module.exports = (req, res, next) => {
  
  try {
    let [authType, authString] = req.headers.authorization.split(/\s+/);
    switch( authType.toLowerCase() ) {
    case 'basic': 
      return _authBasic(authString);
    case 'bearer':
      return _authBearer(authString);
    default: 
      return _authError();
    }
  }
  catch(e) {
    next(e);
  }

  /**
   *checks the type of the authorization
   * @param str
   * @returns {Promise<T>}
   * @private
   */
  function _authBasic(str) {
    // str: am9objpqb2hubnk=
    let base64Buffer = Buffer.from(str, 'base64'); // <Buffer 01 02 ...>
    let bufferString = base64Buffer.toString();    // john:mysecret
    let [username, password] = bufferString.split(':'); // john='john'; mysecret='mysecret']
    let auth = {username,password}; // { username:'john', password:'mysecret' }
    
    return User.authenticateBasic(auth)
      .then(user => _authenticate(user) )
      .catch(next);
  }

  /**
   *checks the jwt token
   * @param authString
   * @returns {Promise<void>}
   * @private
   */
  function _authBearer(authString){
    return User.authenticateToken(authString)
      .then( (user) => _authenticate(user) )
      .catch(next);
  }

  /**
   *if the user exists, creates a token
   * @param user
   * @private
   */
  function _authenticate(user) {
    if(user) {
      req.user = user;
      req.token = user.generateToken();
      next();
    }
    else {
      _authError();
    }
  }

  /**
   *throws an error if the auth is invalid
   * @private
   */
  function _authError() {
    next('Invalid User ID/Password');
  }
  
};