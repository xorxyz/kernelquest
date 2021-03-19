/* eslint-disable no-unused-expressions */
import { Socket } from 'net';
import { debug } from '../../lib/logging';
import { Player } from '../engine/agents/agents';

export default class Connection {
  player: Player
  socket: Socket | null

  constructor(player: Player, socket: Socket) {
    this.socket = socket;
    this.player = player;

    socket.on('close', this.handleExit.bind(this));

    debug('client connected');
  }

  end() {
    this.socket?.end();
    this.socket = null;
  }

  handleExit() {
    debug('exit');
  }
}
