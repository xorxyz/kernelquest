/* eslint-disable no-unused-expressions */
import { Socket } from 'net';
import { EventEmitter } from 'events';
import Shell from '../shell/shell';
import { debug } from '../../lib/logging';
import LineDiscipline from '../shell/line_discipline';

export default class Connection extends EventEmitter {
  public connected = false
  private shell: Shell
  private lineDiscipline: LineDiscipline | null = null
  private socket: Socket | null = null

  connect(socket: Socket): void {
    debug('client connected');

    this.shell = new Shell();
    this.lineDiscipline = new LineDiscipline();
    this.socket = socket;

    this.socket.on('data', (buf) => {
      this.lineDiscipline?.handleBuffer(buf);
    });

    this.lineDiscipline.on('write', (str) => {
      this.socket?.write(str);
    });

    this.lineDiscipline.on('line', (line) => {
      console.log(`line: ${line}`);
      this.socket?.write(line);
    });

    this.lineDiscipline.on('SIGINT', () => {
      this.socket?.end();
    });

    this.lineDiscipline.clearLine();

    this.socket.on('end', this.onDisconnect.bind(this));

    this.connected = true;
    this.emit('connect');
    debug('client connected');
  }

  private onDisconnect(): void {
    debug('client disconnected');
    this.connected = false;
    this.socket = null;
    this.emit('disconnect');
  }
}
