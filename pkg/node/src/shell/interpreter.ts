/*
 * interpret the player's intention by evaluating expressions
 */
import * as EventEmitter from 'events';
import { debug } from '../../lib/logging';
import { Stack } from '../../lib/stack';
import VirtualMachine from './vm';
import { DataStack } from './types';
import operators from './operators';

export default class Interpreter extends EventEmitter {
  private stack: DataStack
  private vm: VirtualMachine

  constructor(vm: VirtualMachine) {
    super();

    this.vm = vm;
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
