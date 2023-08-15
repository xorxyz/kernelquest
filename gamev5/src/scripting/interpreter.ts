import { RuntimeError } from '../shared/errors';
import { IAction } from '../shared/interfaces';
import { Compiler } from './compiler';
import { Dictionary } from './dictionary';
import { Expression } from './expression';
import { Stack } from './stack';

export class Interpreter {
  private dictionary: Dictionary;

  private expression: Expression;

  private index = 0;

  private stack: Stack;

  constructor(dictionary: Dictionary, text: string, stack = new Stack()) {
    this.dictionary = dictionary;
    this.stack = stack;

    const compiler = new Compiler(this.dictionary, text);
    this.expression = compiler.compile();
  }

  get finished(): boolean {
    return this.index >= this.expression.atoms.length;
  }

  run(): IAction | null {
    let action: IAction | null = null;
    while (action === null && !this.finished) {
      action = this.step();
      this.index += 1;
    }

    return action;
  }

  step(): IAction | null {
    if (this.finished) return null;

    const atom = this.expression.atoms.at(this.index);
    if (!atom) throw new RuntimeError(`Unexpected: There was no atom at index '${this.index}'`);

    const action = atom.execute(this.stack, this.dictionary);

    return action;
  }

  print(): string {
    return this.stack.print();
  }
}
