import { createServer, Server, Socket } from 'net';
import { Agent, Engine, Wizard } from 'xor4-game';
import { TTY } from 'xor4-cli';
import Connection from './connection';

export interface Params { src?: string }

export default class GameServer {
  private i: number = 0;
  private engine: Engine;
  private tcpServer: Server;
  private connections: Set<Connection> = new Set();
  private terminals: Set<TTY> = new Set();

  constructor(engine: Engine) {
    this.engine = engine;
    this.tcpServer = createServer(this.onConnection.bind(this));

    process.on('beforeExit', () => this.tcpServer.close());
  }

  async onConnection(socket: Socket) {
    this.i++;
    const agent = new Agent(new Wizard());

    this.engine.world.places[0].put(agent);

    const connection = new Connection(agent, socket, () => {
      const room = this.engine.world.find(agent);

      if (room) {
        room.remove(agent);
      }

      this.connections.delete(connection);
    });

    const terminal = new TTY({
      player: agent,
      place: this.engine.world.places[0],
      write: () => {},
    });

    this.connections.add(connection);
    this.terminals.add(terminal);

    socket.on('data', (buf: Buffer) => {
      console.log(buf);
      terminal.handleInput(buf.toString('hex'));
    });

    socket.on('error', connection.disconnect);
    socket.on('end', connection.disconnect);
    socket.on('close', connection.disconnect);
  }

  listen(...args): void {
    this.tcpServer.listen(...args);
  }
}
