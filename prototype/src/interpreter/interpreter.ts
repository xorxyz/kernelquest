/* 
 * xor's interpreted language
 * manipulate typescript objects with js's reflection capabilities 
 */

import { Stack } from "../../../lib/stack";
import { Compiler } from './compiler';
import { Factor, IProgram } from "./types";

export class Interpretation {
  private level = 0
  private stacks: Array<any>
  private program: IProgram

  constructor(program: IProgram) {
    this.program = program;
  }

  get stack(): Stack<Factor> {
    return this.stacks[this.level];
  }

  set stack(s) {
    this.stacks[this.level] = s;
  }

  start(stack: Stack<Factor>) {
    this.stacks = [stack];

    this.program.term.map((factor: Factor) => {
      factor.validate(this.stack);
      factor.execute(this.stack);
    });

    return this;
  }
}

export class Interpreter {
  stack: Stack<Factor> = new Stack();
  compiler = new Compiler();

  interpret (line: string): Interpretation {  
    const term = this.compiler.compile(line);
    console.log('term:', term);
    
    const interpretation = new Interpretation(term);
    console.log('interpretation:', interpretation);

    return interpretation.start(this.stack);
  }
}
