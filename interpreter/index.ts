/*
 * xor's interpreted language
 * manipulate typescript objects with js's reflection capabilities
 */

import { Stack } from 'xor4-lib/stack';
import { Compiler } from './compiler';
import { Factor, Term } from './types';

export class Interpretation {
  private level = 0;
  private stacks: Array<any>;
  private term: Term;

  constructor(term: Term) {
    this.term = term;
  }

  get stack(): Stack<Factor> {
    return this.stacks[this.level];
  }

  set stack(s) {
    this.stacks[this.level] = s;
  }

  run(stack: Stack<Factor>) {
    this.stacks = [stack];
    console.log(this.term);
    this.term.map((factor: Factor) => {
      factor.validate(this.stack);
      factor.execute(this.stack);
    });

    return this;
  }
}

export class Interpreter {
  stack: Stack<Factor> = new Stack();
  compiler = new Compiler();

  interpret(line: string): Interpretation {
    const term = this.compiler.compile(line);
    console.log('line:', line, 'term:', term);

    const interpretation = new Interpretation(term);

    interpretation.run(this.stack);

    console.log('interpretation:', interpretation);

    return interpretation;
  }
}
