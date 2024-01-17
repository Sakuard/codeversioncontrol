import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";

import * as axiosConfig from './dist/axios.js'

export const askLogin = async () => {
  const user = await inquirer.prompt([
    {
      name: 'account',
      type: 'input',
      message: 'Please enter your account'
    },
    {
      name: 'password',
      type: 'password',
      message: 'Please enter your password'
    }
  ])
  if (user.account === '' || user.password === '') {
    console.log(chalk.red('Plz enter your account and password'))
    await askLogin();
  }
  console.log(`user: `, user);
  let response = await axiosConfig.$axios.post('/v1/user/login', user);
  console.log(`response: `, response.data);
}

export const callAction = async () => {
  const actOptions = ['init', 'push', 'fetch', 'pull', 'clone']
  const actions = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'Please select an action',
    choices: actOptions
  })
  return actions.action;
}

export const actRouter = async (action) => {
  switch (action) {
    case 'init':
      init();
      break;
    case 'push':
      push();
      break;
    case 'fetch':
      fetch();
      break;
    case 'pull':
      pull();
      break;
    case 'clone':
      clone();
      break;
  }
}

/** ========== init ========== */
async function init() {
  console.log(`exec init() ... `)
  const initProjectData = await inquirer.prompt([
    {
      name: 'projectName',
      type: 'input',
      message: 'Please enter your project name.'
    },
    {
      name: 'projectDir',
      type: 'input',
      message: 'Please enter your project directory.'
    }
  ])
  
}


/** ========== push ========== */
function push() {
  console.log(`exec push() ... `)
}

 /** ========== fetch ========== */
function fetch() {
  console.log(`exec fetch() ... `)
}

 /** ========== pull ========== */
function pull() {
  console.log(`exec pull() ... `)
}

 /** ========== clone ========== */
function clone() {
  console.log(`exec clone() ... `)
}