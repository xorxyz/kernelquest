import { RuntimeError } from '../shared/errors';
import { IAction } from '../shared/interfaces';
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

  evaluate(stack: Stack, expression: Expression): IAction | null {
    this.stack = stack;
    this.expression = expression;

    let action: IAction | null = null;
    while (action === null && !this.finished) {
      action = this.step();
      this.index += 1;
    }

    return action;
  }

  print(): string {
    return this.stack.print();
  }

  private step(): IAction | null {
    if (this.finished) return null;

    const atom = this.expression.atoms.at(this.index);
    if (!atom) throw new RuntimeError(`Unexpected: There was no atom at index '${this.index}'`);

    const action = atom.execute(this.stack, this.dictionary);

    return action;
  }
}
