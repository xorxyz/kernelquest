/* eslint-disable no-unused-expressions */
import { Socket } from 'net';
import { EventEmitter } from 'events';
import Shell from '../shell/shell';
import { debug } from '../../lib/logging';
import Engine from '../engine/engine';

export default class Connection extends EventEmitter {
  public connected = false
  private socket: Socket | null = null
  private shell: Shell | null = null

  connect(engine: Engine, socket: Socket): void {
    this.shell = new Shell(engine);
    this.socket = socket;

    this.shell.connect(socket);

    this.socket.on('end', this.onDisconnect.bind(this));

    this.connected = true;
    this.emit('connect');
    debug('client connected');
  }

  private onDisconnect(): void {
    debug('client disconnected');
    this.connected = false;
    this.shell = null;
    this.socket = null;
    this.emit('disconnect');
  }
}
