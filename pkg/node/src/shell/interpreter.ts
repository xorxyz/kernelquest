/*
 * interpret the player's intention by evaluating expressions
 */
import * as EventEmitter from 'events';
import { debug } from '../../lib/logging';
import { Stack } from '../../lib/stack';
import { Player } from '../engine/actors';
import { createHWall, createVWall } from '../engine/effects';
import Engine from '../engine/engine';
import { DataStack, BooleanLiteral } from './types';

const operators = {
  t: (stack: DataStack) => {
    stack.push(new BooleanLiteral(true));
    return stack;
  },
  f: (stack: DataStack) => {
    stack.push(new BooleanLiteral(false));
    return stack;
  },
};

export default class Interpreter extends EventEmitter {
  private stack: DataStack
  private engine: Engine
  private player: Player

  constructor(engine: Engine, player: Player) {
    super();

    this.engine = engine;
    this.player = player;
    this.stack = new Stack();
  }

  eval(expr: string): string {
    debug(`expression: \`${expr}\``);

    const tokens = expr.split(' ');

    debug('tokens:', tokens);

    if (expr === 't') operators.t(this.stack);

    if (tokens[1] === 'hwall' && tokens.length === 2) {
      const length = Number(tokens[0]);
      debug('hwall', length);
      createHWall(length, this.player.position).forEach((wall) => {
        this.engine.walls.push(wall);
      });

      operators.t(this.stack);
    }

    if (tokens[1] === 'vwall' && tokens.length === 2) {
      const length = Number(tokens[0]);
      debug('vwall', length);
      createVWall(length, this.player.position).forEach((wall) => {
        this.engine.walls.push(wall);
      });

      operators.t(this.stack);
    }

    const output = `${this.stack.pop()?.value || '...'}`;

    return output || '';
  }
}
