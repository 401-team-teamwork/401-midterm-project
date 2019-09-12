'use strict';

const inquirer = require('inquirer');

module.exports = {
  getUserNameAndPassword: () => {
    let questions = [
      {
        name: 'username',
        type: 'input',
        message: 'Please Enter Your User Name:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please Enter Your User Name:';
          }
        },
      },
      {
        name: 'password',
        type: 'password',
        mask: '#',
        message: 'Please Enter your Password',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please Enter Your Password';
          }
        },
      },
    ];

    return inquirer.prompt(questions);
  },
};


