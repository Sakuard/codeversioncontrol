import { Request, Response } from 'express';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export const storeRouter = (req: Request, res: Response) => {
  console.log(`exec storeRouter() ...`)
  const tmpdir = process.env.TMP_DIR || '/tmp';
  dirExistCheck(tmpdir);
  const form = new formidable.IncomingForm();
  
  let response = {
    status: 200,
    result: true,
    message: 'success'
  }
  res.send(response);
}

function dirExistCheck(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}