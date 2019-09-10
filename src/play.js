'use strict';
const socketIo = require('socket.io-client');
const View = require('./gameView');


const API_URL = 'http://localhost:8080';

const server = socketIo.connect(`${API_URL}`);

let user = {name: 'Jessica'};

server.emit('new-player', user);

server.on('log', name => {
  console.log(`Welcome ${name}!`);
});

server.on('new-game', game => {
  let view = new View(game, user);
  view.init();
});
