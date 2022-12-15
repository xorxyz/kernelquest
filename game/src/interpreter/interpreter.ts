/*
 * xor's interpreted language
 * manipulate typescript objects with js's reflection capabilities
 */

import { IAction } from '../engine';
import { debug, Queue, Stack } from '../shared';
import { Compiler } from './compiler';
import { Quotation } from './literals';
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
  private paused = false;
  private stack: Stack<Factor>;
  private queue: Queue<IAction>;
  private compiler: Compiler;
  private runtime: IExecutionArguments;
  private continuations: Stack<(done: () => void) => void> = new Stack();

  constructor(compiler: Compiler, stack: Stack<Factor>, queue: Queue<IAction>) {
    this.compiler = compiler;
    this.stack = stack;
    this.queue = queue;
    this.runtime = {
      stack: this.stack,
      dict: this.compiler.dict,
      syscall: this.syscall.bind(this),
      exec: this.exec.bind(this),
    };
  }

  get isPaused() {
    return this.paused;
  }

  pause() {
    this.paused = true;
  }

  unpause() {
    this.paused = false;
  }

  exec(text: string, callback?: (done: () => void) => void) {
    const action = {
      name: 'exec',
      args: { text },
    };

    this.syscall(action, callback);
  }

  syscall(action: IAction, callback?: (done: () => void) => void) {
    this.continuations.push(callback || ((d) => { d(); }));
    this.queue.add(action);
    this.pause();
  }

  next() {
    const continuation = this.continuations.pop();

    if (continuation) {
      continuation(this.unpause.bind(this));
    }
  }

  step(line: string) {
    try {
      debug('interpreter.step', line);
      const term = this.compiler.compile(line);
      debug('term is', term);

      const factor = term.shift();

      if (!factor) return '';
      debug('factor is', factor);

      factor.validate(this.stack);
      factor.execute(this.runtime);

      debug('stack:', JSON.stringify(this.stack.arr.map((a) => a.value)));

      return term.map((t) => t.toString()).join(' ');
    } catch (err) {
      return err as Error;
    }
  }

  // interpret(line: string, queue: Queue<IAction>): Interpretation | Error {
  //   let term;

  //   try {
  //     term = this.compiler.compile(line);
  //   } catch (err) {
  //     return err as Error;
  //   }

  //   const interpretation = new Interpretation(term);
  //   const result = interpretation.run({
  //     queue,
  //     stack: this.stack,
  //     dict: this.compiler.dict,
  //   });

  //   return result;
  // }
}
