import { createServer, Server, Socket } from 'net';
import Connection from './connection';
import Engine from '../engine/engine';
import { Shell } from '../shell/shell';
import { Player } from '../engine/agents/agents';
import { WizardJob } from '../engine/agents/jobs';

export interface Params { src?: string }

export default class GameServer {
  private i: number = 0
  private engine: Engine
  private tcpServer: Server
  private connections: Set<Connection> = new Set()
  private shells: Set<Shell> = new Set()

  constructor(engine: Engine) {
    this.engine = engine;
    this.tcpServer = createServer(this.onConnection.bind(this));

    process.on('beforeExit', () => this.tcpServer.close());
  }

  async onConnection(socket: Socket) {
    const id = this.i++;
    const player = new Player(this.engine, 'john', new WizardJob());
    const connection = new Connection(player, socket);
    const shell = new Shell(id, connection);

    this.engine.rooms[0].add(connection.player, 4, 4);
    this.connections.add(connection);
    this.shells.add(shell);

    socket.on('data', shell.handleInput.bind(shell));
    socket.on('disconnect', () => {
      this.connections.delete(connection);
    });
  }

  listen(...args): void {
    this.tcpServer.listen(...args);
  }
}
