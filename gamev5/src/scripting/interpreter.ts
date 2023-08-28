import { RuntimeError } from '../shared/errors';
import { IAction } from '../shared/interfaces';
import { logger } from '../shared/logger';
import { Dictionary } from './dictionary';
import { Expression } from './expression';
import { Stack } from './stack';

export class Interpreter {
  private dictionary: Dictionary;

  private stack: Stack = new Stack();

  private expression: Expression = new Expression('', []);

  private index = 0;

  constructor(dictionary: Dictionary) {
    this.dictionary = dictionary;
  }

  get finished(): boolean {
    return this.index >= this.expression.atoms.length;
  }

  evaluate(stack: Stack, expression: Expression): void {
    this.index = 0;
    this.stack = stack;
    this.expression = expression;
  }

  print(): string {
    return this.stack.print();
  }

  step(): IAction | null {
    if (this.finished) return null;

    logger.debug('expr', this.expression);

    const atom = this.expression.atoms.at(this.index);
    if (!atom) throw new RuntimeError(`Unexpected: There was no atom at index '${this.index}'`);

    logger.debug('atom', atom);

    const action = atom.execute(this.stack, this.dictionary);

    this.index += 1;

    return action;
  }
}
