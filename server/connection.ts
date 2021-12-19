/* eslint-disable no-unused-expressions */
import { Socket } from 'net';
import { debug } from '../lib/logging';
import { Hero } from '../game/engine/agents';

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
