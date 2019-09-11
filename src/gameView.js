// #!/usr/bin/env node

const color = require('colors');
const ansiEscapes = require('ansi-escapes');
const Game = require('./gameModel');
const statsDB = require('./auth/statistics-model');
const User = require('./auth/users-model');

color.setTheme({
  correct: 'green',
  incorrect: 'red',
  textType: 'blue',
});

const stdin = process.stdin;
const stdout = process.stdout;

class gameView{

  constructor(Game, user){
    this.game = Game;
    this.user = user;
    // this.player = player;
    this.player = this.setPlayer();
  }
  //check the user.name against game.player.user
  setPlayer(){
    if(this.user === this.game.player2.user){
      console.log(this.user, this.game.player1.user);
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
    console.log(this.game);
    sendGameStats(WPM);
    updateUserStats(username);
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
        // stdin.pause();
        this.end();

      }
    });
    this.player.cursor = 0;
  }
}





module.exports = gameView;
