import { RuntimeError } from '../shared/errors';
import { logger } from '../shared/logger';
import { Compiler } from './compiler';
import { Dictionary } from './dictionary';
import { Expression } from './expression';
import { Literal } from './literal';
import { Stack } from './stack';
import { Identifier } from './types/identifier';

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

  run(): void {
    this.expression.atoms.forEach((): void => {
      this.step();
      this.index += 1;
    });
  }

  step(): void {
    if (this.finished) return;

    const atom = this.expression.atoms.at(this.index);
    if (!atom) throw new RuntimeError(`Unexpected: There was no atom at index '${this.index}'`);

    if (atom instanceof Literal) {
      this.stack.push(atom);
      return;
    }

    if (atom instanceof Identifier) {
      logger.debug('Got identifier:', atom.lexeme);
      return;
    }

    throw new RuntimeError(`Unhandled atom type '${atom.constructor.name}' for '${atom.lexeme}'`);
  }

  print(): string {
    return this.stack.print();
  }
}
