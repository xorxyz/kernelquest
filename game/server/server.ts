import { createServer, Server, Socket } from 'net';
import Connection from './connection';
import { Engine } from '../engine/engine';
import { Terminal } from '../ui/terminal';
import { Cherub, Hero } from '../engine/agents';

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
    const player = new Hero(new Cherub());

    this.engine.world.rooms[0].add(player);

    const connection = new Connection(player, socket);
    const terminal = new Terminal(id, connection);

    this.connections.add(connection);
    this.terminals.add(terminal);

    const disconnect = () => {
      connection.end();
      this.connections.delete(connection);
      this.engine.world.find(player)?.remove(player);
    };

    socket.on('data', (buf: Buffer) => {
      terminal.handleInput(buf.toString('hex'));
    });

    socket.on('error', disconnect);
    socket.on('end', disconnect);
    socket.on('close', disconnect);
  }

  listen(...args): void {
    this.tcpServer.listen(...args);
  }
}
