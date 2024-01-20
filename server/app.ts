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
import * as fileStreamRoute from './fileStreamRoute';

const port = process.env.Web_PORT || 3000;
const corsOptions = {
  origin: '*',
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Router = express.Router();
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
// Router.post('/v1/user/push', fileStreamRoute.storeRouter)
// Router.post('/v1/user/push', () => {
//   console.log(`http request: '/v1/user/push`)
// })
app.post('/v1/user/push', (req, res) => {
  fileStreamRoute.storeRouter(req, res);
})
// app.post('/v1/user/push', (req, res) => {
//   console.log(`http request: '/v1/user/push`)
//   let response = {
//     status: 200,
//     result: true,
//     message: 'success'
//   }
//   res.send(response);
// })

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
})