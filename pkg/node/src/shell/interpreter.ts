/*
 * interpret the player's intention by evaluating expressions
 */
import * as EventEmitter from 'events';
import { debug } from '../../lib/logging';
import { isNumeric } from '../../lib/utils';
import { Player } from '../engine/actors';
import { createHWall, createVWall } from '../engine/effects';
import Engine from '../engine/engine';
import {
  Item, DataStack, BooleanLiteral, NumberLiteral,
} from '../engine/items';

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
  stack: DataStack
  private engine: Engine
  private player: Player

  constructor(engine: Engine, player: Player) {
    super();

    this.engine = engine;
    this.player = player;
    this.stack = player.stack;
  }

  eval(expr: string): Item | null {
    debug(`expression: \`${expr}\``);

    const tokens = expr.split(' ');

    debug('tokens:', tokens);

    if (expr === 't') operators.t(this.stack);

    // number
    if (tokens.length === 1 && isNumeric(tokens[0])) {
      const n = Number(tokens[0]);
      if (n >= 0 && n < 256) {
        debug('number:', n);
        this.stack.push(new NumberLiteral(n));
      }
    }

    if (tokens[2] === 'tele' && tokens.length === 3) {
      const [x, y] = tokens.slice(0, 2).map(Number);

      this.player.position.setXY(x, y);

      operators.t(this.stack);
    }

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

    return this.stack.pop() || null;
  }
}
