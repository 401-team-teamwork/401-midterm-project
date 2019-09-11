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
    if(user1 !== null && user2 !== null){
      socket.close();
    }
    else if(user1 === null){
      user1 = {name: 'trae'};
    } else {
      user2 = {name: 'Josh'};
    }
    console.log(user1, user2);
    socket.emit('log', player.name);
    if(user1 && user2 ){
      //start the game
      let game = new Game(user1, user2);
      console.log(game.player2, game.player1);
      socketIoServer.local.emit('new-game', game);
    }

  });



  socket.on('file-save', object => {
    console.log('File has been saved');
    console.log(object);
    socket.broadcast.emit('file-save', object.saved);
  });

  socket.on('file-error', error => {
    socket.broadcast.emit('file-error', error);
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



