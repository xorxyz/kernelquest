/*
 * xor's interpreted language
 * manipulate typescript objects with js's reflection capabilities
 */

import { IAction } from '../engine';
import { debug, LINE_LENGTH, Stack } from '../shared';
import { Factor, Term } from './types';

export class Interpreter {
  index = 0;
  stack: Stack<Factor> = new Stack();
  term: Term = [];

  action: IAction | null = null;
  callback: (() => void) | null = null;
  waiting = false;

  subinterpreter: Interpreter | null = null;

  get stackStr() {
    return this.subinterpreter
      ? `${this.stack.toString()} [ ${this.subinterpreter.stackStr} ]`
      : this.stack.toString();
  }

  interpret(term: Term) {
    // if I'm already working on some term, create a sub interpreter
    if (this.isBusy()) {
      if (this.subinterpreter) {
        this.subinterpreter.interpret(term);
        return;
      }
      debug(`${this.index}) creating subinterpreter to run '${term.map((f) => f.toString()).join(' ')}'`);
      const next = new Interpreter();
      next.index = this.index + 1;
      (this.stack.popN(this.stack.length) as Array<Factor>).forEach((f) => {
        next.stack.push(f);
      });
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
      debug(`${this.index}) came back with`, this.subinterpreter.stack.toString());
      this.subinterpreter.stack.arr.forEach((f) => {
        this.stack.push(f);
      });
      debug(`stack: ${this.stackStr}`);
      this.subinterpreter = null;
    }

    if (this.action) {
      return;
    }

    const factor = this.term.shift();

    if (!factor) {
      return;
    }

    factor.validate(this.stack);
    debug(`${this.index}) running '${factor.toString()}'`);
    factor.execute({
      stack: this.stack,
      syscall: this.syscall.bind(this),
      exec: this.exec.bind(this),
    });
    debug(`stack: ${this.stackStr}`);
  }

  sysret(factor: Factor) {
    const interpreter = this.findCurrentInterpreter();

    interpreter.stack.push(factor);
    interpreter.waiting = false;
    if (interpreter.callback) {
      debug(`${this.index}) calling callback`);
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

  isWaiting() {
    return this.subinterpreter
      ? this.subinterpreter.isWaiting()
      : this.waiting;
  }

  private syscall(action: IAction) {
    debug('running syscall:', action);
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
