/*
 * xor's interpreted language
 * manipulate typescript objects with js's reflection capabilities
 */

import { IAction } from '../engine';
import { debug, Stack } from '../shared';
import {
  ExecuteFn, Factor, Interpretation, Term,
} from './types';

export class Interpreter {
  public action: IAction | null = null;
  private baseInterpretation: Interpretation;
  private interpretations: Stack<Interpretation> = new Stack();
  private waiting = false;
  private continuation: ExecuteFn | null;

  constructor() {
    this.baseInterpretation = {
      stack: new Stack(),
      term: [],
    };
  }

  get currentInterpretation(): Interpretation {
    const index = this.interpretations.length - 1;
    const interpretation = this.interpretations.peekN(index);
    return interpretation || this.baseInterpretation;
  }

  handleSyscall() {
    const { action } = this;

    this.action = null;

    return action;
  }

  syscall(action: IAction, continuation?: ExecuteFn) {
    this.action = action;
    this.continuation = continuation || null;
    this.waiting = true;
  }

  sysret(factor: Factor) {
    const { continuation } = this;

    this.waiting = false;
    this.continuation = null;

    this.currentInterpretation?.stack.push(factor);
    if (continuation) continuation();
  }

  exec(term: Term) {
    if (this.waiting) {
      debug('exec(): waiting, skip');
      return;
    }
    debug('exec:', term);

    term.forEach((f) => this.currentInterpretation.term.push(f));
  }

  asyncExec(term: Term, continuation?: ExecuteFn) {
    if (this.waiting) {
      debug('asyncExec(): waiting, skip');
      return;
    }
    debug('asyncExec:', term);

    this.interpretations.push({
      stack: new Stack(),
      term,
      continuation,
    });
  }

  step() {
    if (this.waiting) {
      debug('step(): waiting, skip');
      return;
    }
    const interpretation = this.currentInterpretation;
    const factor = interpretation.term.shift();
    if (!factor) return;

    debug('step:', factor);

    factor.validate(interpretation.stack);
    factor.execute({
      ...interpretation,
      exec: this.asyncExec.bind(this),
      syscall: this.syscall.bind(this),
    });

    const termIsEmpty = !interpretation.term.length;

    if (termIsEmpty) {
      debug('termIsEmpty.');
      if (interpretation.continuation) {
        debug('running contination.');
        interpretation.continuation({
          ...interpretation,
          exec: this.asyncExec.bind(this),
          syscall: this.syscall.bind(this),
        });
      }
    }
  }
}

// export class Interpretation {
//   public term: Term;
//   public stack: Stack<Factor>;

//   constructor(term: Term) {
//     this.term = term;
//   }

//   run(execArgs: IExecutionArguments): Interpretation | Error {
//     this.stack = execArgs.stack;
//     for (let i = 0; i < this.term.length; i++) {
//       const factor = this.term[i];
//       try {
//         factor.validate(execArgs.stack);
//         factor.execute(execArgs);
//       } catch (err) {
//         return err as Error;
//       }
//     }

//     return this;
//   }
// }
