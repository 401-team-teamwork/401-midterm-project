// #!/usr/bin/env node

const color = require('colors');
const ansiEscapes = require('ansi-escapes');
const socketIo = require('socket.io-client');
const initialUserPrompts = require('./userPrompts').initialUserPrompts;
const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');
const colemak = require('convert-layout/colemak');
const dvorak = require('convert-layout/dvorak');

color.setTheme({
  correct: 'green',
  incorrect: 'red',
});

const API_URL = 'http://localhost:8080';
const EXIT_GAME = '\u0003';
const DELETE_LAST_ENTRY = '\u007f';
const INDICATE_INCORRECT_KEYPRESS = 'f';
const INDICATE_CORRECT_KEYPRESS = 't';
const ONE_MINUTE = 60000;
const ONE_SECOND = 1000;

const server = socketIo.connect(`${API_URL}`);
const stdin = process.stdin;
const stdout = process.stdout;

let user;

class gameView{

  constructor(string, name){
    this.stringToType = string;
    this.player = {
      name: name,
      currentCursorPosition: 0,
      typedString: '',
      correctEntries: 0,
      incorrectEntries: 0,
      startTime: null,
      endTime: null,
      //this string will track if each letter is correct or incorrect as entered by the user
      typedStringInBooleanForm: '',
      wordsPerMinute: 0,
      finished: false,
    };
  }

  calculateWordsPerMinute(){
    const wordsArray = this.stringToType.split(' ');
    const length = wordsArray.length;
    const time = this.computeTimeInMinutes();
    return length/time;
  }

  computeTimeInMinutes(){
    return (this.player.endTime - this.player.startTime)/ONE_MINUTE;
  }

  computeTimeInSeconds(){
    return (this.player.endTime - this.player.startTime)/ONE_SECOND;
  }

  endTheGame() {
    stdout.write(`\nYou took ${this.computeTimeInSeconds()} Seconds`);
    stdout.write(`\nYou typed ${this.player.typedString} \n Correct Keys: ${this.player.correctEntries} \n Incorrect Keys: ${this.player.incorrectEntries}`);
    this.player.wordsPerMinute = this.calculateWordsPerMinute();
    this.player.finished = true;
    console.log(this.game);
    server.emit('player-finished', this.player);
    // updateUserStats(this.player.correct, this.player.incorrect, WPM);
    //add data to DB
  }
  correctKeyTyped(key){
    this.player.typedStringInBooleanForm += INDICATE_CORRECT_KEYPRESS;
    this.player.typedString += key;
    this.player.correctEntries++;
    stdout.write(key.correct);
  }

  incorrectKeyTyped(key){
    this.player.typedStringInBooleanForm += INDICATE_INCORRECT_KEYPRESS;
    this.player.typedString += key;
    this.player.incorrectEntries++;
    stdout.write(key.incorrect);
  }

  stopRecordingUserInput(){
    if (this.player.currentCursorPosition >= this.stringToType.length){
      return true;
    }
    else{
      return false;
    }
  }

  init(){
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    stdout.write(`\nStart typing:\n${this.stringToType}\n\n`);

    this.player.startTime = Date.now();

    stdin.on('data', (key) => {
      if(user.keyboardInput === 'dvorak'){
        key = dvorak.fromEn(key);
      } else if(user.keyboardInput === 'colemak'){
        key = colemak.fromEn(key);
      }
      //control + C exits the program
      if(this.stopRecordingUserInput()){
        this.player.endTime = Date.now();
        this.endTheGame();
      } else {
        if (key === EXIT_GAME) {
          process.exit();
        }
        //Let Delete work to fix errors
        else if (key === DELETE_LAST_ENTRY){
          //if the last letter you typed was wrong...
          if(this.player.typedStringInBooleanForm.slice(-1) === INDICATE_INCORRECT_KEYPRESS){
            this.player.incorrectEntries--;
          }
          //if the last letter you typed was correct
          else if (this.player.typedStringInBooleanForm.slice(-1) === INDICATE_CORRECT_KEYPRESS){
            this.player.correctEntries--;
          }
          this.player.typedString = this.player.typedString.slice(0, -1);
          this.player.currentCursorPosition -= 1;
          //move the cursor backone space
          stdout.write(ansiEscapes.cursorBackward(1));
        }
        else {
          if (key === this.stringToType[this.player.currentCursorPosition]) {
            this.correctKeyTyped(key);
          } else {
            this.incorrectKeyTyped(key);
          }
          this.player.currentCursorPosition++;
        }
      }
    });
    this.player.currentCursorPosition = 0;
  }

}


//Clears the console and displays the title
clear();
console.log(
  chalk.blueBright(
    figlet.textSync('SUPERTYPE :   REVOLUTION', {font:'ANSI Shadow', horizontalLayout: 'full' })
  )
);

//intitial prompts to get a player when the socket connects
const run = async () => {
  user = await initialUserPrompts();
  server.emit('new-player', user);
  console.log(user);
};
run();




//Socket listeners
server.on('log', message => {
  console.log(message);

});



server.on('new-game', game => {
  let view = new gameView(game.text, user.username);
  clear();
  console.log('New Game!');
  view.init();
});

server.on('end-game', message => {
  console.log(message);
  console.log(`Thank you for playing ${user.username}!\n\n`);
  process.exit();
});
// this function will apply new game statistics to a specific player.
function updateUserStats(username, correct, incorrect, WPM) {
  if(User.findOne({username: username})) {
    User.stats.push({lettersCorrect: correct});
    User.stats.push({lettersIncorrect: incorrect});
    User.stats.push({wordsPerMinute: WPM});
  }
  else{
    console.error(username);
  }

}



// function to calculate a point value that is used to determine a winning player. needs more work.
function getPlayerPoints(incorrect, WPM) {
  return WPM - incorrect;
}






module.exports = gameView;
