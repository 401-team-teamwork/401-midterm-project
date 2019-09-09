#!/usr/bin/env node

const color = require('colors');

color.setTheme({
  correct: 'green',
  incorrect: 'red',
})

const stdin = process.stdin;
const stdout = process.stdout;

let text;
let cursor = 0;
let results = '';
let correct = 0;
let incorrect = 0;

function init(){
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');

  text = 'Hello, Josh';

  console.log(`\n  Start typing:\n ${text}\n`);

  stdin.on('data', (key) => {
    if (key === '\u0003') {
      process.exit();
    }
    if(cursor > text.length){
      console.log(results, correct, incorrect);
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
  });
  console.log(results);
  cursor = 0;
}
init();