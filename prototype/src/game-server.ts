import { Engine } from '../../game/engine/engine';
import { Terminal } from '../../game/ui/terminal';
import { Hero, Wizard } from '../../game/engine/agents';
import { debug } from '../../lib/logging';

export interface Params { src?: string }

export default class Connection {
  player: Hero
  socket: Socket | null
  public disconnect

  constructor(player: Hero, socket: Socket, disconnect) {
    this.socket = socket;
    this.player = player;
    this.disconnect = disconnect;

    debug('client connected');
  }
}

export default class GameServer {
  private i: number = 0
  private engine: Engine
  private tcpServer: Server
  private connections: Set<Connection> = new Set()
  private terminals: Set<Terminal> = new Set()

  constructor(engine: Engine) {
    this.engine = engine;
    // this.tcpServer = createServer(this.onConnection.bind(this));

    process.on('beforeExit', () => this.tcpServer.close());
  }

  // async onConnection(socket: Socket) {
  //   const id = this.i++;
  //   const player = new Hero(new Wizard());

  //   player.name = 'Guest';
  //   player.hp.increase(10);
  //   player.mp.increase(10);
  //   player.position.setXY(3,0)

  //   this.engine.world.rooms[0].add(player);

  //   const connection = new Connection(player, socket, () => {
  //     const room = this.engine.world.find(player)
      
  //     if (room) {
  //       room.remove(player);
  //     }

  //     this.connections.delete(connection);
  //   });

  //   const terminal = new Terminal(id, connection);

  //   this.connections.add(connection);
  //   this.terminals.add(terminal);

  //   socket.on('data', (buf: Buffer) => {
  //     console.log(buf);
  //     terminal.handleInput(buf.toString('hex'));
  //   });

  //   socket.on('error', connection.disconnect);
  //   socket.on('end', connection.disconnect);
  //   socket.on('close', connection.disconnect);
  // }

  listen(...args): void {
    // this.tcpServer.listen(...args);
  }
}
