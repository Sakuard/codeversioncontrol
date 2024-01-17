// @ts-check
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import * as http from 'http';
import * as https from 'https';
import { createSpinner } from 'nanospinner';
dotenv.config();


// import * as axiosConfig from './axios.js'
import SocketClient from './dist/socketClient.js';
import * as SysHandler from './syshandler.js';
import * as cvsClient from './CodeversionClient.js';
import { fileURLToPath } from 'url';

const port = process.env.Web_PORT || 3000;

const spinner = createSpinner('Loading...');
spinner.start();
let serverIsReady = false;
let userCache, versionCache;

/** cache file init */
const __rootdir = path.dirname(fileURLToPath(import.meta.url));
const cacheDir = path.join(__rootdir, 'cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  serverIsReady = true;
  doSystemInit()
  spinner.success({ text: `System running port: ${port}`});
});

async function doSystemInit() {
  let {userCacheData, versionCacheData} = await SysHandler.systemInit();
  // console.log(`init result: `,(SysHandler.systemInit()));
  userCache = userCacheData
  versionCache = versionCacheData
  // console.log(`userCache: `, userCache, ', versionCache: ', versionCache);
}

const io = new SocketClient(process.env.CVS_BASEURL || '');
const main = async () => {
  if (!serverIsReady) {
    setTimeout(() => {
      main();
    },200)
    return;
  }
  try {
  
    await cvsClient.askLogin();
    let action = await cvsClient.callAction();
    await cvsClient.actRouter(action);
  
  }catch(err) {
    console.log(`err: `, err);
  }

  main();
}
main();
