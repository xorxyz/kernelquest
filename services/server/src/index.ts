import * as http from 'http';
import * as express from 'express';
import * as uuid from 'uuid';

import sessionParser from './session';
import ws from './ws';

const PORT = 3000;
const app = express();
const server = http.createServer(app);

app.use(sessionParser);
app.use(express.json({
  limit: '1kb',
  strict: true,
  inflate: true,
  type: 'application/json',
}));

app.use((req, res, next) => {
  if (!req.session.userId) {
    req.session.userId = uuid.v4();
  }
  next();
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.end('ok');
});

ws(server, app);

server.listen(PORT, () => console.log('listening on ', PORT));
