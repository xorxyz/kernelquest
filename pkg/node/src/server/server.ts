import { createServer, Server, Socket } from 'net';
import Connection from './connection';
import Engine from '../engine/engine';

export interface Params { src?: string }

export default class GameServer {
  private engine: Engine
  private tcpServer: Server
  private connections: Set<Connection>

  constructor(engine: Engine) {
    this.engine = engine;
    this.connections = new Set();
    this.tcpServer = createServer(this.onConnection.bind(this));

    process.on('beforeExit', () => this.tcpServer.close());
  }

  async onConnection(socket: Socket) {
    const connection = new Connection();

    connection.on('disconnect', () => {
      this.connections.delete(connection);
    });

    connection.connect(this.engine, socket);

    this.connections.add(connection);
  }

  listen(...args): void {
    this.tcpServer.listen(...args);
  }
}