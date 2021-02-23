/* eslint-disable no-unused-expressions */
import { Socket } from 'net';
import { debug } from '../../lib/logging';
import Engine from '../engine/engine';
import { Player } from '../engine/actors/actors';

export default class Connection {
  engine: Engine
  player: Player
  socket: Socket

  constructor(player: Player, socket: Socket) {
    this.socket = socket;
    this.player = player;

    socket.on('close', this.handleExit.bind(this));

    debug('client connected');
  }

  end() {
    this.socket.end();
  }

  handleExit() {
    debug('exit');
  }
}
