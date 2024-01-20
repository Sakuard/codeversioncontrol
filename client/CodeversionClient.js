import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";

import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import * as axiosConfig from './dist/axios.js'
import * as SysHandler from './syshandler.js';
import { FileStream } from './dist/fileStreaming.js';

let userCache, versionCache, fileStream;
fileStream = new FileStream();
export const askLogin = async () => {
  console.log(`\nUser Login ...`)
  const user = await inquirer.prompt([
    {
      name: 'account',
      type: 'input',
      message: 'Account: '
    },
    {
      name: 'password',
      type: 'password',
      message: 'Password: '
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
  userCache = JSON.parse(fs.readFileSync('./cache/user.json', 'utf8'));
  versionCache = JSON.parse(fs.readFileSync('./cache/version.json', 'utf8'));
  switch (action) {
    case 'init':
      await init();
      break;
    case 'push':
      await push();
      break;
    case 'fetch':
      await fetch();
      break;
    case 'pull':
      await pull();
      break;
    case 'clone':
      await clone();
      break;
  }
}

/** ========== init ========== */
async function init() {
  console.log(`\nProject inintial ...`)
  const initProject = await inquirer.prompt([
    {
      name: 'Group',
      type: 'input',
      message: 'Group:'
    },
    {
      name: 'Name',
      type: 'input',
      message: 'Project Name: '
    },
    {
      name: 'Path',
      type: 'input',
      message: 'Project Path: '
    }
  ])
  if (initProject.Name === '' || initProject.Path === ''|| initProject.Group === '') {
    console.log(chalk.red('Plz key in Project Data'))
    let confirm = await SysHandler.askConfirm()
    if (confirm) {
      await init();
    }
    return;
  }
  let newProject = {
    guid: uuidv4(),
    group: initProject.Group,
    projname: initProject.Name,
    projpath: initProject.Path,
    createtime: new Date().toLocaleString(),
    createuser: userCache.account? userCache.account: '',
    version: '0.1.0'
  }
  versionCache.push(newProject);
  fs.writeFileSync('./cache/version.json', JSON.stringify(versionCache, null, 2), 'utf8');
}

/** ========== push ========== */
async function push() {
  console.log(`\nProject push ... `)
  let selectProject = await cacheProjectSelect();
  const pushProjectVersion = await inquirer.prompt({
    name: 'version',
    type: 'input',
    message: `Version(now: ${selectProject.version}): `
  })
  selectProject.version = pushProjectVersion.version;
  console.log(`selectProject: `, selectProject);
  // let result = await fileStream.setData(selectProject).StartStream();
  let result = await fileStream.setData(selectProject);
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
  
/** ========== general ========== */
async function cacheProjectSelect() {
  const cacheProject = await inquirer.prompt({
    name: 'project',
    type: 'list',
    message: 'Please select a project',
    choices: versionCache.map((item) => {
      return {
        name: item.projname,
        value: item
      }
    })
  })
  return cacheProject.project;
}