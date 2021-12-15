const http = require('http');
const childProcess = require('child_process');
const WebSocket = require('ws');
const express = require('express');

const PORT = 3737;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients: Set<any> = new Set();

wss.on('connection', ws => {
  console.log('Client connected.', clients.size, 'clients.'); 

  let client = childProcess.spawn('nc', ['localhost', '3000'], {
    shell: true,
    timeout: 2 * 60 * 1000,
    cwd: '/tmp',
    env: {},
  });

  clients.add(client);

  console.log('started sh');

  client.stdout.on('data', (buf: Buffer) => ws.send(buf.toString()))
  client.stderr.on('data', (buf: Buffer) => ws.send(buf.toString()))

  ws.on('message', (msg) => {
    client.stdin.write(Buffer.from(msg as string, 'utf8'))
  })
  ws.on('error', () => console.log('ws: on error'))
  ws.on('close', () => {
    console.log('ws: on close');
    client.stdin.write(Buffer.from('', 'utf8'));
    clients.delete(client);
  })
});

server.listen(PORT, () => console.log('listening on ' + PORT));

process.on('beforeExit', () => {
  server.close();
  console.log('bye!');
});
