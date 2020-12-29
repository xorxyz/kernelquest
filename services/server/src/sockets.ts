/* eslint-disable operator-linebreak */
import { Response } from 'express';
import * as WebSocket from 'ws';
import * as url from 'url';
import sessionParser from './session';
import PlayerConnection from './connection';

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

    wss.handleUpgrade(req, socket, head, (ws) => {
      if (!connections.has(req.session.userId)) {
        addConnection(ws, req.session.userId);
      }

      console.log('done upgrade');
    });

    return true;
  });

  return wss;
}

async function validate(req): Promise<boolean> {
  const { pathname } = url.parse(req.url);
  const isValidRequest = (
    (pathname === '/') || (pathname === '/sh')
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

function addConnection(ws: WebSocket, userId: string) {
  const connection = new PlayerConnection(ws, userId);

  connections.set(connection.userId, connection);

  ws.on('close', function (reason) {
    console.log('close', reason);
    connections.delete(connection.userId);
  });
}
