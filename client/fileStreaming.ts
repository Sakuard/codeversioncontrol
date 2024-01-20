import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

import * as axiosConfig from './axios.js';

interface FileData {
  guid: string;
  group: string;
  projname: string;
  projpath: string;
  createtime: string;
  createuser: string;
  updatetime: string;
  updateuser: string;
  version: string;
}
export class FileStream {
  private filedata: object;
  private ignore: string[];
  private files: string[];

  constructor() {
    this.filedata = {};
    this.ignore = [];
    this.files = []
  }
  private async setData(data: FileData) {
    this.filedata = data;
    let _ignore = fs.readFileSync('.ignore', 'utf8').split('\n');
    console.log(_ignore)
    await this.filter(data.projpath, this.ignore);
    await this.StartStream(data);
    return this;
  }
  private async filter(dir: string, ignore: string[]){
    let projpath = dir;
    let files:any = [];
    const list = fs.readdirSync(projpath);
    for (const file of list) {
      if (ignore.includes(file)) {
        continue;
      }
      const filepath = path.resolve(projpath, file);
      const stat = fs.statSync(filepath);

      if (stat && stat.isDirectory()) {
        files = files.concat(await this.filter(filepath, ignore));
      }else {
        files.push(filepath);
      }
    }

    this.files = files;
    return this
  }
  private async StartStream(projectData: FileData) {
    console.log(`Start Stream`)
    try {
      for (const file of this.files) {
        const filename = path.basename(file);
        const filepath = path.dirname(file);
        const filestructure = path.dirname(file).replace(projectData.projpath, '');
        const formData = new FormData();
        formData.append('file', fs.createReadStream(file));
        formData.append('group', projectData.group)
        formData.append('projectID', projectData.guid);
        formData.append('projectName', projectData.projname);
        formData.append('filename', filename)
        formData.append('fileguid', uuidv4());
        formData.append('filestructure', filestructure);
        formData.append('filehash', this.fileHash(filepath));
        let response = await axiosConfig.$axios.post('/v1/user/push', formData, {
          headers: {
            ...formData.getHeaders()
          }
        })
      }
    }catch (err) {
      console.log(err)
    }
    return this;
  }
  private fileHash(filepath: string) {
    return fs.statSync(filepath).isFile() ? crypto.createHash('sha256').update(fs.readFileSync(filepath)).digest('hex') : ''
  }
}