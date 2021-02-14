/*
 * interpret the player's intention by evaluating expressions
 */
import * as EventEmitter from 'events';
import { debug } from '../../lib/logging';
import { Stack } from './stack';
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

  constructor() {
    super();

    this.stack = new Stack();
  }

  eval(expr: string): DataStack {
    debug(`$> ${expr}`);
    const words = expr.split(' ').filter((x) => x);

    words.map((x) => x.replace('\n', '')).forEach((word) => {
      if (!word) return;

      const operator = operators[word];

      if (operator) {
        debug(`exec: '${word}'`);
        operator(this.stack);
      } else {
        debug(`push: '${word}'`);
        this.stack.push(word);
      }
    });

    return this.stack;
  }
}
