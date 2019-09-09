'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require( './middleware/error.js');
const notFound = require( './middleware/404.js' );


// Prepare the express app
const app = express();

//Route files
const apiRouter = require('./routes/api');
const authRouter = require( './auth/router.js' );

// App Level MW
app.use(cors());
app.use(morgan('dev'));
app.use('/docs', express.static('./docs'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Home Route
app.get('/', (request, response) => {
  response.status(200).send('App is up!');
});

app.use(authRouter);
app.use(apiRouter);


// Catchalls
app.use('/*', notFound);
app.use(errorHandler);


module.exports = {
  server: app,
  start: (port) => app.listen(port || 3000, () => console.log(`Server up on port ${port}`) ),
};

