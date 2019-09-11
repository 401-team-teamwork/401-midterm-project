'use strict';

// 3rd Party Resources

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const socketIoServer = require('socket.io')(8080);
const Game = require('./gameModel');

// Esoteric Resources
const errorHandler = require( './middleware/error.js');
const notFound = require( './middleware/404.js' );

//Sockets


let user1 = null;
let user2 = null;
let game;

//on connection, prompt login
//client: on succesful login, emit username or id to the server
//instantiate a new game
//send a message to the client that contains the game instance
//clinet initiates a new view, passing in player and game
//client: on game over, emit to server
//server: when both clients complete the game, run game end logic
//emit results to the client

socketIoServer.on('connection', socket => {
  console.log('Connected', socket.id);

  socket.on('new-player', player => {
    if (user1 !== null && user2 !== null) {
      socket.close();
    } else if (user1 === null) {
      user1 = player.username;
    } else {
      user2 = player.username;
    }
    console.log(user1, user2);
    socket.emit('log', player.username);
    if (user1 && user2) {
      //start the game
      game = new Game(user1, user2);

      socketIoServer.local.emit('new-game', game);
    }
  });

  socketIoServer.on('player-finished', () => {
    if (game.player1.finished && game.player2.finished) {
      socketIoServer.local.emit('end-game', game);
    }
    });
});

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



