import { createServer, Server, Socket } from 'net';
import Connection from './connection';
import Engine from '../engine/engine';
import { Terminal } from '../shell/terminal';
import { Player } from '../engine/actors';

export interface Params { src?: string }

export default class GameServer {
  private i: number = 0
  private engine: Engine
  private tcpServer: Server
  private connections: Set<Connection> = new Set()
  private terminals: Set<Terminal> = new Set()

  constructor(engine: Engine) {
    this.engine = engine;
    this.tcpServer = createServer(this.onConnection.bind(this));

    process.on('beforeExit', () => this.tcpServer.close());
  }

  async onConnection(socket: Socket) {
    const id = this.i++;
    const player = new Player('john');

    const connection = new Connection(player, socket);
    const terminal = new Terminal(id, connection, this.engine);

    this.engine.actors.push(connection.player);
    this.connections.add(connection);
    this.terminals.add(terminal);

    socket.on('data', terminal.handleInput.bind(terminal));
    socket.on('disconnect', () => {
      this.connections.delete(connection);
    });

    player.position.setXY(4, 4);
  }

  listen(...args): void {
    this.tcpServer.listen(...args);
  }
}
