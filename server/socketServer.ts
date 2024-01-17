// @ts-check
import * as socketio from 'socket.io';

// const io = new socketio.Server();
class SocketServer {
  private io: any;

  constructor(server: any) {
    this.io = new socketio.Server(server);
    this.io.on('connection', (socket:any) => {
      console.log(`user ${socket.id} connected`);
      // setInterval(() => {
      //   socket.emit('message', `Hello from server`)
      // }, 3000)
    })
  }
}

export default SocketServer;