#!/usr/bin/env node
const color = require('colors');
const ansiEscapes = require('ansi-escapes');

color.setTheme({
  correct: 'green',
  incorrect: 'red',
  textType: 'blue',
});

const stdin = process.stdin;
const stdout = process.stdout;

let text;
let cursor = 0;
let results = '';
let correct = 0;
let incorrect = 0;
let startTime;
let endTime;
let elapsedTime;


function start() {
  text = 'Hello, Josh';
  //generate a random String and set it
  //do other things?
}

function end() {

  console.log(`\n You took ${(endTime - startTime)/1000} Seconds`);
  console.log(` You typed ${results} \n Correct: ${correct} \n Incorrect: ${incorrect}`);
  //generate stats
  //add data to DB

}


function init(){
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');
  start();
  stdout.write(`\n  Start typing:\n ${text.textType}\n\n`);
  startTime = Date.now();
  stdin.on('data', (key) => {
  //control + C exits the program
    if (key === '\u0003') {
      process.exit();
    }
    //Let Delete work to fix errors
    if (key === '\u007f'){
      results = results.slice(0, -1);
      incorrect -= 2;
      cursor -= 2;
      stdout.write(ansiEscapes.cursorBackward(1));
    }
    if (key === text[cursor]) {
      results += key;
      correct++;
      stdout.write(key.correct);
    } else {
      results += key;
      incorrect++;
      stdout.write(key.incorrect);
    }

    cursor++;
    if(cursor >= text.length){
      endTime = Date.now();
      end();
      process.exit();
    }
  });
  cursor = 0;
}
init();