/* eslint-disable no-unused-expressions */
import { Socket } from 'net';
import { EventEmitter } from 'events';
import { write } from 'fs';
import Shell from '../shell/shell';
import { debug } from '../../lib/logging';
import LineDiscipline from '../shell/line_discipline';
import Engine from '../engine/engine';

export default class Connection extends EventEmitter {
  public connected = false
  private shell: Shell
  private lineDiscipline: LineDiscipline | null = null
  private socket: Socket | null = null

  connect(engine: Engine, socket: Socket): void {
    this.shell = new Shell(engine);
    this.lineDiscipline = new LineDiscipline();
    this.socket = socket;

    this.socket.on('data', (buf) => {
      this.lineDiscipline?.handleBuffer(buf);
    });

    this.lineDiscipline.on('write', (str) => {
      this.socket?.write(str);
    });

    this.lineDiscipline.on('line', (line) => {
      this.socket?.write(`${line}`);
      const outputs = this.shell.handleLine(line);

      outputs.forEach((output) => {
        console.log('output:', output);
        this.socket?.write(output);
      });
    });

    this.lineDiscipline.on('SIGINT', () => {
      this.socket?.end();
    });

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
