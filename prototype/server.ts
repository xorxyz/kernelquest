import * as http from 'http';
import * as express from 'express';
import * as WebSocket from 'ws';
import * as childProcess from 'child_process';

const PORT = 3737;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('Client connected.'); 

  const client = childProcess.spawn('nc', ['localhost', '3000'], {
    shell: true,
    timeout: 2 * 60 * 1000,
    cwd: '/tmp',
    env: {},
  });

  console.log('started sh');

  client.stdout.on('data', (buf: Buffer) => ws.send(buf.toString()))
  client.stderr.on('data', (buf: Buffer) => ws.send(buf.toString()))

  ws.on('message', (msg: string) => client.stdin.write(Buffer.from(msg, 'utf8')))
  ws.on('close', () =>client.kill())
});

server.listen(PORT, () => console.log('listening on ' + PORT));

process.on('beforeExit', () => {
  server.close();
  console.log('bye!');
});
