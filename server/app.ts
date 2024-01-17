// @ts-check
import express from 'express';
import dotenv from 'dotenv';
import * as https from 'https';
import * as http from 'http';
import axios from 'axios';
import cors from 'cors';
// import * as socketio from 'socket.io'; 
dotenv.config();

import SocketServer from './socketServer'

const port = process.env.Web_PORT || 3000;
const corsOptions = {
  origin: '*',
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);

app.get('/', (req, res) => {
  console.log(`http request: '/`)
  res.send('Hello world');
})

app.post('/v1/user/login', (req, res) => {
  console.log(`http request: '/v1/user/login`)
  const { account, password } = req.body;
  console.log(`account: ${account}, password: ${password}`);
  let response = {
    status: 200,
    result: true,
    message: 'login success'
  }
  res.send(response);
})

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
})