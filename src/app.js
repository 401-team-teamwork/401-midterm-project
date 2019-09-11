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
let game = null;

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

    socket.emit('log', `Welcome ${player.username}`);

    if (user1 && user2) {
      //start the game
      game = new Game();
      socketIoServer.local.emit('new-game', game);
    }

    socket.on('player-finished', (player) => {
      if(game.player1 === null){
        game.player1 = player;
      } else if (game.player2 === null){
        game.player2 = player;
      }
      if (game.player1 !== null && game.player2 !== null) {
        game.winner = game.calculateWinner(game.player1, game.player2)
        socketIoServer.local.emit('end-game', `\n\nAnd the winner is: ${game.winner.name}`);
        user1 = null;
        user2 = null;
      }
    });
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



