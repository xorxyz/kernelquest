/* eslint-disable no-unused-expressions */
import { Socket } from 'net';
import { debug } from '../../lib/logging';
import { Player } from '../engine/agents/agents';

export default class Connection {
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
