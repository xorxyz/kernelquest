/* eslint-disable operator-linebreak */
import { Response } from 'express';
import * as WebSocket from 'ws';
import * as url from 'url';
import sessionParser from './session';

import queues from './queues';

class PlayerConnection {
  public userId: string
  private ws: WebSocket

  constructor(ws: WebSocket, userId: string) {
    console.log('new connection', userId);
    this.ws = ws;
    this.userId = userId;

    ws.on('message', (message: string) => {
      console.log('got message:', message);
      try {
        const o = JSON.parse(message);
        console.log('parsed message:', o);
        ws.send(JSON.stringify({ message }));
      } catch (err) {
        console.error(`message from ${this.userId} is not json:`, message);
      }
    });
  }
}

const connections = new Map();

export default createWSS;

function createWSS(app) {
  const wss = new WebSocket.Server({ noServer: true });

  app.on('upgrade', async (req, socket, head) => {
    console.log('want to upgrade to ws');

    const isValid = await validate(req);
    if (!isValid) { return dropSocket(socket); }

    const isAuthorized = await authorize(req);
    if (!isAuthorized) { return dropSocket(socket); }

    wss.handleUpgrade(req, socket, head, onUpgrade);

    return true;
  });

  return wss;
}

async function validate(req): Promise<boolean> {
  const { pathname } = url.parse(req.url);
  const isValidRequest = (
    (pathname === '/')
  );
  console.log('isValidRequest:', isValidRequest);

  if (!isValidRequest) return false;

  return true;
}

async function authorize(req): Promise<boolean> {
  try {
    await parseSession(req);

    const isAuthorized = (
      !!req.session.userId
    );

    console.log('isAuthorized:', isAuthorized);

    return isAuthorized;
  } catch (err) {
    console.error('err parsing session:', err);
    return false;
  }
}

function dropSocket(socket) {
  console.warn('dropping socket');
  socket.destroy();
  return false;
}

function parseSession(req) {
  return new Promise((resolve, reject) => {
    sessionParser(req, {} as Response, (err) => {
      if (err) return reject(err);

      console.log('session parsed:', req.session);

      return resolve(null);
    });
  });
}

function onUpgrade(ws, req) {
  if (!connections.has(req.session.userId)) {
    addConnection(ws, 'test-id');
  }

  console.log('done upgrade');
}

function addConnection(ws: WebSocket, userId: string) {
  const connection = new PlayerConnection(ws, userId);

  connections.set(connection.userId, connection);

  ws.on('close', function (reason) {
    console.log('close', reason);
    connections.delete(connection.userId);
  });
}
