// @ts-check
import * as socketio from 'socket.io-client'

class SocketClient {
  private io: any;

  constructor(server: any) {
    if (server !== '' || server !== undefined) {
      this.io = socketio.io(server);
      this.io.on('connect', () => {
        console.log(`connected to server as ${this.io.id}`)
        this.io.on('message', (message:string) => {
          console.log(message)
        })
      })
    }
    else {
      console.log(`SocketServer is not Defined`)
    }
  }
}
export default SocketClient;