/* eslint-disable no-unused-expressions */
import { Socket } from 'net';
import { EventEmitter } from 'events';
import * as uuid from 'uuid';
import Shell from '../shell/shell';
import { debug } from '../../lib/logging';
import Engine from '../engine/engine';

export default class Connection extends EventEmitter {
  private id: string = uuid.v4()
  private shell: Shell | null = null

  connect(engine: Engine, socket: Socket): void {
    const context = Object.freeze({
      id: this.id,
    });

    this.shell = new Shell(context, engine);
    this.shell.connect(socket);

    socket.on('end', this.disconnect.bind(this));
    debug('client connected');
  }

  private disconnect(): void {
    debug('client disconnected');
    this.shell = null;
    this.emit('disconnect');
  }
}
