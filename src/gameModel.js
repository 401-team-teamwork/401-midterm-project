const SG = require('sentence-generator');
const sG = SG('./words.txt');
const player = require('./playerModel');



class Game {
  constructor(user1, user2){
    this.player1 = {
      user: user1,
      cursor: 0,
      results: '',
      correct: 0,
      incorrect: 0,
      startTime: null,
      endTime: null,
      //this string will track if each letter is correct or incorrect as entered by the user
      resultsStatus: '',
      wordsPerMinute: 0,
    };
    this.player2 = {
      user: user2,
      cursor: 0,
      results: '',
      correct: 0,
      incorrect: 0,
      startTime: null,
      endTime: null,
      //this string will track if each letter is correct or incorrect as entered by the user
      resultsStatus: '',
      wordsPerMinute: 0,
    };
    this.text = generateString();
  }

  generateString(){
    return sG.take(1);
  }

  wordsPerMinute(text, startTime, endTime){
    let length = text.split(' ').length;
    let time = endTime - startTime;
    return length/(time/60000);
  }

}

module.exports = Game;




