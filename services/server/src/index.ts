import * as http from 'http';
import * as express from 'express';
import * as uuid from 'uuid';

import * as io from 'socket.io';

import sessionParser from './session';

const PORT = 3000;
const app = express();
const server = http.createServer(app);

const ws = new io.Server(server, {
  allowUpgrades: true,
  path: '/ws',
  cors: {
    credentials: true,
    origin: 'http://localhost:1234',
    preflightContinue: true,
  },
  serveClient: false,
  maxHttpBufferSize: 1e6,
  cookie: false,
  // allowRequest(req, callback) {
  //   callback('500', false);
  // },
});

ws.use(async (socket, next) => {
  console.log('ws middle');
  next();
});

ws.on('connection', (socket: io.Socket) => {
  console.log(socket.id);

  socket.on('disconnecting', (reason) => {
    console.log('disconnecting', reason);
  });

  socket.on('disconnect', (reason) => {
    console.log('disconnect', reason);
  });
});

server.listen(PORT, () => console.log('listening on ', PORT));

// app.use(sessionParser);
// app.use(express.json({
//   limit: '1kb',
//   strict: true,
//   inflate: true,
//   type: 'application/json',
// }));

// app.use((req, res, next) => {
//   if (!req.session.userId) {
//     req.session.userId = uuid.v4();
//   }

//   next();
// });

// app.get('/logout', (req, res) => {
//   req.session.destroy();
//   res.end('ok');
// });
