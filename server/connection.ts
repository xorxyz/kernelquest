/* eslint-disable no-unused-expressions */
import { Socket } from 'net';
import { debug } from 'xor4-lib/utils';
import { Hero } from 'xor4-game/engine/agents';

export default class Connection {
  player: Hero;
  socket: Socket | null;
  public disconnect;

  constructor(player: Hero, socket: Socket, disconnect) {
    this.socket = socket;
    this.player = player;
    this.disconnect = disconnect;

    debug('client connected');
  }
}
