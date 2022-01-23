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

  async run(stack: Stack<Factor>, queue?: Queue<any>) {
    this.stack = stack;
    for (let i = 0; i < this.term.length; i++) {
      const factor = this.term[i];
      factor.validate(stack);
      // eslint-disable-next-line no-await-in-loop
      factor.execute(stack, queue);
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

  interpret(line: string, queue: Queue<any>): [Error] | [null, Interpretation] {
    const term = this.compiler.compile(line);
    const interpretation = new Interpretation(term);

    try {
      interpretation.run(this.stack, queue);
      return [null, interpretation];
    } catch (err) {
      return [err as Error];
    }
  }
}
