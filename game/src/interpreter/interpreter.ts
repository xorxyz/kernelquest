/*
 * xor's interpreted language
 * manipulate typescript objects with js's reflection capabilities
 */

import { IAction } from '../engine';
import { debug, Queue, Stack } from '../shared';
import { Compiler } from './compiler';
import {
  Factor, IExecutionArguments, Term,
} from './types';

export class Interpretation {
  public term: Term;
  public stack: Stack<Factor>;

  constructor(term: Term) {
    this.term = term;
  }

  run(execArgs: IExecutionArguments): Interpretation | Error {
    this.stack = execArgs.stack;
    for (let i = 0; i < this.term.length; i++) {
      const factor = this.term[i];
      try {
        factor.validate(execArgs.stack);
        factor.execute(execArgs);
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

  step(line: string, queue: Queue<IAction>) {
    debug('interpreter.step', line);
    const term = this.compiler.compile(line);
    debug('term is', term);
    try {
      const factor = term.shift();

      if (!factor) return '';
      debug('factor is', factor);

      factor.validate(this.stack);
      factor.execute({
        queue,
        stack: this.stack,
        dict: this.compiler.dict,
      });

      debug('stack:', JSON.stringify(this.stack.arr.map((a) => a.value)));

      return term.map((t) => t.toString()).join(' ');
    } catch (err) {
      return err as Error;
    }
  }

  interpret(line: string, queue: Queue<IAction>): Interpretation | Error {
    let term;

    try {
      term = this.compiler.compile(line);
    } catch (err) {
      return err as Error;
    }

    const interpretation = new Interpretation(term);
    const result = interpretation.run({
      queue,
      stack: this.stack,
      dict: this.compiler.dict,
    });

    return result;
  }
}
