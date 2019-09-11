const SG = require('sentence-generator');
const sG = SG('./words.txt');
const player = require('./playerModel');



class Game {
  constructor(){
    this.text = this.generateString();
    this.player1 = null;
    this.player2 = null;
    this.winner = null;
  }

  generateString(){
    return sG.take(1);
  }

  //naive winner calculation
  calculateWinner(player1, player2){
    if(player1.wordsPerMinute > player2.wordsPerMinute){
      return player1;
    } else if (player2.wordsPerMinute > player1.wordsPerMinute){
      return player2;
    } else {
      return 'Tie';
    }

  }

}

module.exports = Game;




