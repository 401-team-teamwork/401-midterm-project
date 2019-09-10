#!/usr/bin/env node

const color = require('colors');
const ansiEscapes = require('ansi-escapes');
const Game = require('gameModel');

color.setTheme({
  correct: 'green',
  incorrect: 'red',
  textType: 'blue',
});

const stdin = process.stdin;
const stdout = process.stdout;

class gameView{
  constructor(Game, player){
    this.game = Game;
    this.player = player;
  }

  end() {
    stdout.write(`\n You took ${(this.game.player.endTime - this.game.player.startTime)/1000} Seconds`);
    stdout.write(` You typed ${this.game.player.results} \n Correct: ${this.game.player.correct} \n Incorrect: ${this.game.player.incorrect}`);
    //generate stats
    //add data to DB
  }

  init(){
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    //call start from gameModel Class
    stdout.write(`\n  Start typing:\n ${this.game.text.textType}\n\n`);
    this.game.player.startTime = Date.now();
    stdin.on('data', (key) => {
      //control + C exits the program
      if (key === '\u0003') {
        process.exit();
      }
      //Let Delete work to fix errors
      else if (key === '\u007f'){
        //if the last letter you typed was wrong...
        if(this.game.player.resultsStatus.slice(-1) === 'f'){
          this.game.player.incorrect--;
        }
        //if the last letter you typed was correct
        else if (this.game.player.resultsStatus.slice(-1) === 't'){
          this.game.player.correct--;
        }
        this.game.player.results = this.game.player.results.slice(0, -1);
        this.game.player.cursor -= 2;
        //move the cursor back
        stdout.write(ansiEscapes.cursorBackward(1));
      }
      else if (key === this.game.text[this.game.player.cursor]) {
        this.game.player.resultsStatus += 't';
        this.game.player.results += key;
        this.game.player.correct++;
        stdout.write(key.correct);
      } else {
        this.game.player.resultsStatus += 'f';
        this.game.player.results += key;
        this.game.player.incorrect++;
        stdout.write(key.incorrect);
      }
      this.game.player.cursor++;
      //if the user has reached the end of the string, stop reading input
      if(this.game.player.cursor >= this.game.text.length){
        this.game.player.endTime = Date.now();
        stdin.pause();
        this.end();

      }
    });
    this.game.player.cursor = 0;
  }
}



module.exports = gameView;
