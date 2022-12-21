/*
 * xor's interpreted language
 * manipulate typescript objects with js's reflection capabilities
 */

import { IAction } from '../engine';
import { debug, Stack } from '../shared';
import { Factor, Term } from './types';

export class Interpreter {
  stack: Stack<Factor> = new Stack();
  term: Term = [];

  action: IAction | null = null;
  callback: (() => void) | null = null;
  waiting = false;

  subinterpreter: Interpreter | null = null;

  interpret(term: Term) {
    // if I'm already working on some term, create a sub interpreter
    if (this.isBusy()) {
      debug(`creating subinterpreter to run '${term.map((f) => f.toString()).join(' ')}'`);
      const next = new Interpreter();
      next.interpret(term);
      this.subinterpreter = next;
      return;
    }

    this.term = term;
  }

  isBusy() {
    return (this.term && this.term.length);
  }

  step() {
    // prioritize subinterpreters
    if (this.subinterpreter) {
      // if the subinterpreter still has work to do, let it step instead
      if (this.subinterpreter.term.length) {
        this.subinterpreter.step();
        return;
      }
      // if it's done, get the results back on top of this stack, and get rid of the sub
      debug('came back with', this.subinterpreter.stack.arr.map((x) => x.toString()).join(' '));
      this.subinterpreter.stack.arr.forEach((f) => {
        this.stack.push(f);
      });
      this.subinterpreter = null;
    }

    if (this.action) {
      debug('interpreter.step(): waiting for sysret, skipping', this.action.name);
      return;
    }

    const factor = this.term.shift();

    if (!factor) {
      debug('interpreter.step(): term is now empty, skipping');
      return;
    }

    factor.validate(this.stack);
    debug(`running '${factor.toString()}'`);
    factor.execute({
      stack: this.stack,
      syscall: this.syscall.bind(this),
      exec: this.exec.bind(this),
    });
  }

  sysret(factor: Factor) {
    const interpreter = this.findCurrentInterpreter();

    interpreter.stack.push(factor);
    interpreter.waiting = false;
    if (interpreter.callback) {
      debug('calling callback');
      interpreter.callback();
      interpreter.callback = null;
    }
  }

  takeAction() {
    const interpreter = this.findCurrentInterpreter();

    const { action } = interpreter;

    interpreter.action = null;

    return action;
  }

  private syscall(action: IAction) {
    this.action = action;
    this.waiting = true;
  }

  private findCurrentInterpreter(): Interpreter {
    return this.subinterpreter
      ? this.subinterpreter.findCurrentInterpreter()
      : this;
  }

  private exec(term: Term, callback?: () => void) {
    this.callback = callback || null;
    this.syscall({
      name: 'exec',
      args: {
        text: term.map((f) => f.toString()).join(' '),
      },
    });
  }
}
