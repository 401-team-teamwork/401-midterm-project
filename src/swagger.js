const express = require('express');
const swaggerServer = express();
const expressSwagger = require('express-swagger-generator')(swaggerServer);

let options = {
  swaggerDefinition: {
    info: {
      description: 'API Server',
      title: 'Swaggertastic Docs!',
      version: '1.0.1',
    },
    host: 'localhost:3000',
    basePath: '/',
    produces: [
      'application/json',
    ],
    schemes: ['http'],
    securityDefinitions: {
      basicAuth: {
        type: 'basic',
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ['./routes/api.js', './auth/router.js'], //Path to the API handle folder
};
expressSwagger(options);
swaggerServer.listen(3333);

// start up a specific standalone swagger server on a specific port
// http://[domain]/api-docs
