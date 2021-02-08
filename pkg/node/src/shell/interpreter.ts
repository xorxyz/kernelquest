import { info } from 'console';
import { debug } from '../../lib/logging';
import { Stack } from '../../lib/stack';
import {
  DataStack,
  StringLiteral,
} from './types';

export default class Interpreter {
  private stack: DataStack

  constructor() {
    this.stack = new Stack();
  }

  eval(expr: string) {
    debug(`"${expr}" expr eval`);

    const words = expr.split(' ').filter((x) => x);

    words.forEach((word) => {
      switch (word) {
        case '':
          /* noop */
          break;
        case 'ping':
          this.stack.push(new StringLiteral('pong'));
          break;
        case 'dup':
          this.stack.push(this.stack.peek());
          break;
        case 'ls':
          info(this.stack.list.map((x) => `${x}\n`));
          break;
        default:
          console.error(`\`${word}\` "unhandled word"`);
          break;
      }
    });
  }
}
