'use strict';
const socketIo = require('socket.io-client');
const View = require('./gameView');
const getUserNameAndPassword = require('./userPrompts').getUserNameAndPassword;
const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');


const API_URL = 'http://localhost:8080';

const server = socketIo.connect(`${API_URL}`);

let user;

clear();
console.log(
  chalk.blueBright(
    figlet.textSync('SUPERTYPE :   REVOLUTION', {font:'ANSI Shadow', horizontalLayout: 'full' })
  )
);

const run = async () => {
  user = await getUserNameAndPassword();
  server.emit('new-player', user);
};
run();



server.on('log', name => {
  console.log(name);

});

server.on('new-game', game => {
  let view = new View(game, user);
  console.log('New Game!');
  view.init();
});

server.on('end-game', game => {
  console.log(game);
  process.exit();
});

module.exports = server;

