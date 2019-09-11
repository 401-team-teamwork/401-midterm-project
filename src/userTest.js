const getUserNameAndPassword = require('./userPrompts').getUserNameAndPassword;
const clear = require('clear');
const figlet = require('figlet');
// const inquirer = require('inquirer');
const chalk = require('chalk');



clear();
console.log(
  chalk.blueBright(
    figlet.textSync('SUPERTYPE :   REVOLUTION', {font:'ANSI Shadow', horizontalLayout: 'full' })
  )
);

const run = async () => {
  const userStuff = await getUserNameAndPassword();
  console.log(userStuff);
};
run();

