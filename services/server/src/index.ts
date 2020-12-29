import * as http from 'http';
import * as express from 'express';
import * as uuid from 'uuid';
import * as cors from 'cors';

import sessionParser from './session';
import createWSS from './sockets';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const PORT = 3000;
const app = express();

app.use(cors({
  origin: 'http://localhost:1234',
  credentials: true,
}));

app.use(sessionParser);

app.use(express.json({
  limit: '100b',
  strict: true,
}));

const server = http.createServer(app);

createWSS(server);

app.get('/login', function (req, res) {
  console.log('login, session:', req.session);

  req.session.userId = uuid.v4();

  console.log('new user id:', req.session.userId);

  res.end();
});

app.get('/me', function (req, res) {
  res.json(req.session);
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    console.error('destroy err:', err);
  });

  res.end('ok');
});

server.listen(PORT, () => console.log('listening on ', PORT));
