import { RuntimeError } from '../shared/errors';
import { IAction } from '../shared/interfaces';
import { logger } from '../shared/logger';
import { Dictionary } from './dictionary';
import { Expression } from './expression';
import { Stack } from './stack';

export type RuntimeExecution = Generator<IAction | null, number>

export class Interpreter {
  private dictionary: Dictionary;

  private stack: Stack = new Stack();

  private expression: Expression = new Expression('', []);

  private index = 0;

  constructor(dictionary: Dictionary) {
    this.dictionary = dictionary;
  }

  get done(): boolean {
    return this.index >= this.expression.atoms.length;
  }

  evaluate(stack: Stack, expression: Expression): RuntimeExecution {
    this.index = 0;
    this.stack = stack;
    this.expression = expression;

    return this.start();
  }

  print(): string {
    return this.stack.print();
  }

  private* start(): RuntimeExecution {
    while (!this.done) {
      yield this.step();
    }

    return 0;
  }

  private step(): IAction | null {
    if (this.done) return null;

    const atom = this.expression.atoms[this.index];
    if (!atom) throw new RuntimeError(`Unexpected: There was no atom at index '${this.index}'`);

    logger.debug('atom', atom);

    const action = atom.execute(this.stack, this.dictionary);

    this.index += 1;

    return action;
  }
}
