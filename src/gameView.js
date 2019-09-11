// #!/usr/bin/env node

const color = require('colors');
const ansiEscapes = require('ansi-escapes');
// const Game = require('./gameModel');

color.setTheme({
  correct: 'green',
  incorrect: 'red',
  textType: 'blue',
});

const stdin = process.stdin;
const stdout = process.stdout;

const socketIo = require('socket.io-client');
const getUserNameAndPassword = require('./userPrompts').getUserNameAndPassword;
const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');


const API_URL = 'http://localhost:8080';

const server = socketIo.connect(`${API_URL}`);

let user;

class gameView{

  constructor(game, user){
    this.game = game;
    this.user = user;
    // this.player = player;
    this.player = this.setPlayer();
  }
  //check the user.name against game.player.user

  setPlayer(){
    if(this.user.username === this.game.player1.user){
      return this.game.player1;
    } else {
      return this.game.player2;
    }
  }

  calculateWordsPerMinute(text, startTime, endTime){
    let wordsArray = text.split(' ');
    let length = wordsArray.length;
    let time = endTime - startTime;
    return length/(time/60000);
  }

  end() {
    stdout.write(`\n You took ${(this.player.endTime - this.player.startTime)/1000} Seconds`);
    stdout.write(` You typed ${this.player.results} \n Correct: ${this.player.correct} \n Incorrect: ${this.player.incorrect}`);
    let WPM = this.calculateWordsPerMinute(this.game.text, this.player.startTime, this.player.endTime);
    this.player.wordsPerMinute = WPM;
    this.player.finished = true;
    console.log(this.game);
    server.emit('player-finished', this.game);

    //add data to DB
  }

  init(){
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    //call start from gameModel Class
    stdout.write(`\n  Start typing:\n ${this.game.text.textType}\n\n`);
    this.player.startTime = Date.now();
    stdin.on('data', (key) => {
      //control + C exits the program
      if (key === '\u0003') {
        process.exit();
      }
      //Let Delete work to fix errors
      else if (key === '\u007f'){
        //if the last letter you typed was wrong...
        if(this.player.resultsStatus.slice(-1) === 'f'){
          this.player.incorrect--;
        }
        //if the last letter you typed was correct
        else if (this.player.resultsStatus.slice(-1) === 't'){
          this.player.correct--;
        }
        this.player.results = this.player.results.slice(0, -1);
        this.player.cursor -= 2;
        //move the cursor back
        stdout.write(ansiEscapes.cursorBackward(1));
      }
      else if (key === this.game.text[this.player.cursor]) {
        this.player.resultsStatus += 't';
        this.player.results += key;
        this.player.correct++;
        stdout.write(key.correct);
      } else {
        this.player.resultsStatus += 'f';
        this.player.results += key;
        this.player.incorrect++;
        stdout.write(key.incorrect);
      }
      this.player.cursor++;
      //if the user has reached the end of the string, stop reading input
      if(this.player.cursor >= this.game.text.length){
        this.player.endTime = Date.now();
        this.end();
        if (key === '\u0003') {
          process.exit();
        } else {
          return;
        }
      }
    });
    this.player.cursor = 0;

  }

}

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
  let view = new gameView(game, user);
  console.log('New Game!');
  view.init();
});

server.on('end-game', game => {
  console.log(game);
  process.exit();
});

module.exports = gameView;
