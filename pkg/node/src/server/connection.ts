/* eslint-disable no-unused-expressions */
import { Socket } from 'net';
import { EventEmitter } from 'events';
import Shell from '../shell/shell';
import { debug } from '../../lib/logging';
import Engine from '../engine/engine';
import LineEditor from '../shell/ui/line_editor';

export default class Connection extends EventEmitter {
  public connected = false
  private socket: Socket | null = null
  private shell: Shell

  connect(engine: Engine, socket: Socket): void {
    this.shell = new Shell(engine, socket);
    this.socket = socket;

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
