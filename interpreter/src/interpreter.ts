/*
 * xor's interpreted language
 * manipulate typescript objects with js's reflection capabilities
 */

import { Queue } from 'xor4-lib/queue';
import { Stack } from 'xor4-lib/stack';
import { Compiler } from './compiler';
import { Factor, Term } from './types';

export class Interpretation {
  public term: Term;
  public stack: Stack<Factor>;

  constructor(term: Term) {
    this.term = term;
  }

  run(stack: Stack<Factor>, queue?: Queue<any>): Interpretation | Error {
    this.stack = stack;
    for (let i = 0; i < this.term.length; i++) {
      const factor = this.term[i];
      try {
        factor.validate(stack);
        factor.execute(stack, queue);
      } catch (err) {
        return err as Error;
      }
    }

    return this;
  }
}

export class Interpreter {
  private stack: Stack<Factor>;
  private compiler: Compiler;

  constructor(compiler: Compiler, stack?: Stack<Factor>) {
    this.compiler = compiler;
    this.stack = stack || new Stack();
  }

  interpret(line: string, queue: Queue<any>): Interpretation | Error {
    let term;

    try {
      term = this.compiler.compile(line);
    } catch (err) {
      return err as Error;
    }

    const interpretation = new Interpretation(term);
    const result = interpretation.run(this.stack, queue);

    return result;
  }
}
