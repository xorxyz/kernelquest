import { createServer, Server, Socket } from 'net';
import Connection from './connection';
import Engine from '../engine/engine';
import { Terminal } from '../shell/terminal';
import { Player } from '../engine/agents/agents';
import { WizardJob } from '../engine/agents/jobs';
import { debug } from '../../lib/logging';

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
    const player = new Player(this.engine, 'john', new WizardJob());
    const connection = new Connection(player, socket);
    const terminal = new Terminal(id, connection);

    this.engine.rooms[0].add(connection.player, 4, 4);
    this.connections.add(connection);
    this.terminals.add(terminal);

    socket.on('data', (buf: Buffer) =>
      terminal.handleInput(buf.toString('hex')));

    socket.on('error', (err) => {
      debug('error', err);
      connection.end();
      this.connections.delete(connection);
      const room = this.engine.rooms.find((r) => r.agents.some((a) => a === player));
      if (room) room.remove(player);
    });

    socket.on('end', () => {
      debug('end');
      connection.end();
      this.connections.delete(connection);
      const room = this.engine.rooms.find((r) => r.agents.some((a) => a === player));
      if (room) room.remove(player);
    });

    socket.on('close', () => {
      debug('close');
      connection.end();
      this.connections.delete(connection);
      const room = this.engine.rooms.find((r) => r.agents.some((a) => a === player));
      if (room) room.remove(player);
    });
  }

  listen(...args): void {
    this.tcpServer.listen(...args);
  }
}
