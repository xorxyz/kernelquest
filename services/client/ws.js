const WebSocket = require('ws');
const uuid = require('uuid');
const sessionParser = require('./session')

const sockets = new WebSocket.Server({
  clientTracking: false,
  noServer: true,
  path: '/ws'
});

module.exports = function (server) {
  server.on('upgrade', function (request, socket, head) {
    console.debug('upgrade')

    sessionParser(request, {}, () => {
      if (!request.session.userId) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }
  
      sockets.handleUpgrade(request, socket, head, function (client) {
        console.debug('handle upgrade')

        client.emit('connection', client, request);
      });
    });
  });

  sockets.on('connection', function (client, request) {
    const userId = request.session.userId;

    console.log(userId + ' connected')
  
    client.on('message', function (message) {
      console.log(`Received message ${message} from user ${userId}`);
    });
  
    client.on('close', function () {
      console.log(userId + ' closed')
    });

    client.send('hi')
  });
}
