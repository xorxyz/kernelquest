/*
 * xor's interpreted language
 * manipulate typescript objects with js's reflection capabilities
 */

import { Stack } from 'xor4-lib/stack';
import { Compiler } from './compiler';
import { Factor, Term } from './types';

export class Interpretation {
  public stack: Stack<Factor>;
  private term: Term;

  constructor(term: Term) {
    this.term = term;
  }

  run(stack: Stack<Factor>) {
    this.stack = stack;

    for (let i = 0; i < this.term.length; i++) {
      const factor = this.term[i];
      factor.validate(stack);
      factor.execute(stack);
    }

    return this;
  }
}

export class Interpreter {
  private stack: Stack<Factor>;
  private compiler = new Compiler();

  constructor(stack?: Stack<Factor>) {
    this.stack = stack || new Stack();
  }

  interpret(line: string): Interpretation {
    const term = this.compiler.compile(line);
    const interpretation = new Interpretation(term);

    return interpretation.run(this.stack);
  }
}
