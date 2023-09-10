import { RuntimeError } from '../shared/errors';
import { IAction } from '../shared/interfaces';
import { logger } from '../shared/logger';
import { Queue } from '../shared/queue';
import { Atom } from './atom';
import { Dictionary } from './dictionary';
import { Expression } from './expression';
import { Stack } from './stack';

export type RuntimeExecution = Generator<IAction | null, null>

export class Interpreter {
  private dictionary: Dictionary;

  private stack: Stack = new Stack();

  private expression: Expression = new Expression('', []);

  private index = 0;

  private queue = new Queue<Atom>();

  constructor(dictionary: Dictionary) {
    this.dictionary = dictionary;
  }

  get done(): boolean {
    return this.queue.isEmpty() && this.index >= this.expression.atoms.length;
  }

  evaluate(stack: Stack, expression: Expression): RuntimeExecution {
    this.index = 0;
    this.stack = stack;
    this.expression = expression;

    return this.start();
  }

  printStack(): string {
    return this.stack.print();
  }

  printExpression(): string {
    const expr = this.expression.atoms.slice(this.index).map(atom => atom.toString()).join(' ');
    const queue = this.queue.items.map((atom) => atom.toString()).join(' ')
    return `${expr} ${queue}`
  }

  private* start(): RuntimeExecution {
    while (!this.done) {
      yield this.step();
    }

    return null;
  }

  private step(): IAction | null {
    if (this.done) return null;

    const atom = this.queue.next() ?? this.expression.atoms[this.index];
    if (!atom) throw new RuntimeError(`Unexpected: There was no atom at index '${this.index}'`);

    const action = atom.execute(this.stack, this.dictionary, this.queue);

    this.index += 1;

    return action;
  }
}
