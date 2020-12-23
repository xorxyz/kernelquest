import * as WebSocket from 'ws';
import sessionParser from './session';

const sockets = new WebSocket.Server({
  clientTracking: false,
  noServer: true,
  path: '/ws',
});

export default websockets;

function websockets(server) {
  server.on('upgrade', (request, socket, head) => {
    console.debug('upgrade');

    sockets.handleUpgrade(request, socket, head, (client) => {
      client.emit('connection', client, request);
    });

    // sessionParser(request, {}, () => {
    //   if (!request.session.userId) {
    //     socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    //     socket.destroy();
    //     return;
    //   }

    //   sockets.handleUpgrade(request, socket, head, (client) => {
    //     client.emit('connection', client, request);
    //   });
    // });
  });

  sockets.on('connection', (client, request) => {
    const { userId } = request.session;

    console.log(`${userId} connected`);

    client.on('message', (message) => {
      console.log(`Received message ${message} from user ${userId}`);
    });

    client.on('close', () => {
      console.log(`${userId} closed`);
    });

    client.send('hi');
  });
}
