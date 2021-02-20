/* eslint-disable no-unused-expressions */
import { Socket } from 'net';
import { EventEmitter } from 'events';
import * as uuid from 'uuid';
import Shell from '../shell/shell';
import { debug } from '../../lib/logging';
import Engine from '../engine/engine';
import { Wizard } from '../engine/actors';

export default class Connection extends EventEmitter {
  private id: string = uuid.v4()
  private shell: Shell | null = null

  connect(engine: Engine, socket: Socket): void {
    const context = Object.freeze({
      id: this.id,
      player: new Wizard('john'),
    });

    context.player.position.setXY(3, 2);

    engine.actors.push(context.player);

    this.shell = new Shell(context, engine);
    this.shell.connect(socket);

    debug('client connected');
  }
}
