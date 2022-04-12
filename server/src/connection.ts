/* eslint-disable no-unused-expressions */
import { Socket } from 'net';
import { debug } from 'xor4-lib';
import { Agent } from 'xor4-game';

export default class Connection {
  player: Agent;
  socket: Socket | null;
  public disconnect;

  constructor(player: Agent, socket: Socket, disconnect) {
    this.socket = socket;
    this.player = player;
    this.disconnect = disconnect;

    debug('client connected');
  }
}
