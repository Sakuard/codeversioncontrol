// @ts-check
import dotenv from 'dotenv';
import fs from 'fs';
import { createSpinner } from 'nanospinner';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();


export const ServerCheck = (serverIsReady) => {
  if (!serverIsReady) {
    setTimeout(() => {
      ServerCheck(serverIsReady);
    },200)
    return;
  }
}

export function systemInit() {
  const initSpinner = createSpinner('Initializing ... ').start();
  const __rootdir = fileURLToPath(import.meta.url);
  const rootdir = path.dirname(__rootdir);
  const __cachedir = path.join(rootdir, 'cache');
  if (!fs.existsSync(__cachedir)) {
    fs.mkdirSync(__cachedir);
  }
  const userCache = path.join(__cachedir, 'user.json');
  const versionCache = path.join(__cachedir, 'version.json');
  if (!fs.existsSync(userCache)) {
    fs.writeFileSync(userCache, JSON.stringify({}, null, 2),'utf8');
  }
  if (!fs.existsSync(versionCache)) {
    fs.writeFileSync(versionCache, JSON.stringify([], null, 2),'utf8');
  }

  let _userCacheData = fs.readFileSync(userCache, 'utf8');
  let _versionCacheData = fs.readFileSync(versionCache, 'utf8');

  // console.log(`exec systemInit()..`)
  initSpinner.success({ text: 'System is ready' });
  return {
    userCacheData: _userCacheData,
    versionCacheData: _versionCacheData,
  }
}

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}