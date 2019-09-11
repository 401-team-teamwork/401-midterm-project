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
    this.text = this.generateString();
  }

  generateString(){
    return sG.take(1);
  }


  calculateWinner(player1WPM, player2WPM){
    if(this.player1.wordsPerMinute > this.player2.wordsPerMinute){
      return this.player1;
    } else if (this.player2.wordsPerMinute > this.player1.wordsPerMinute){
      return this.player2;
    } else {
      return 'Tie';
    }

  }

}



module.exports = Game;




