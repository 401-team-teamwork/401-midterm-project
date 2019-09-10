#!/usr/bin/env node

const color = require('colors');
const ansiEscapes = require('ansi-escapes');
const SG = require('sentence-generator');
const sG = SG('./words.txt');

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
//this string will track if each letter is correct or incorrect as entered by the user
let resultsStatus = '';


function generateString() {
  return sG.take(1);
}

function start() {
  text = generateString();
  //do other things?
}

function end() {
  stdout.write(`\n You took ${(endTime - startTime)/1000} Seconds`);
  stdout.write(` You typed ${results} \n Correct: ${correct} \n Incorrect: ${incorrect}`);
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
    else if (key === '\u007f'){
      //if the last letter you typed was wrong...
      if(resultsStatus.slice(-1) === 'f'){
        incorrect--;
      }
      //if the last letter you typed was correct
      else if (resultsStatus.slice(-1) === 't'){
        correct--;
      }
      results = results.slice(0, -1);
      cursor -= 2;
      //move the cursor back
      stdout.write(ansiEscapes.cursorBackward(1));
    }
    else if (key === text[cursor]) {
      resultsStatus += 't';
      results += key;
      correct++;
      stdout.write(key.correct);
    } else {
      resultsStatus += 'f';
      results += key;
      incorrect++;
      stdout.write(key.incorrect);
    }
    cursor++;
    //if the user has reached the end of the string, stop reading input
    if(cursor >= text.length){
      endTime = Date.now();
      stdin.pause(); 
      end();

    }
  });
  cursor = 0;
}
init();