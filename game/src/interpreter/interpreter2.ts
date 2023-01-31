import { IAction } from '../engine';
import { Queue, Stack } from '../shared';
import { Factor, Term } from './types';

// How to use this in the game loop:
//
// Every cycle, try to run as many steps of the interpreter as SP available
// while (interpreter.term?.length && !interpreter.halted && sp >= 0)
//   sp--
//   try
//     interpreter.step()
//   catch
//     if (err instanceof ValidationError)
//       break
//     if (err instanceof ExecutionError)
//       break
// action = interpreter.syscalls.next()
// if (action) return action
// return queue.next()

export class Interpreter {
  level = 0;
  stack: Stack<Factor> = new Stack();
  term: Term = [];
  logs: Array<string> = [];
  syscalls: Queue<IAction> = new Queue();
  callbacks: Queue<() => void> = new Queue();
  halted = false;
  subinterpreter: Interpreter | null = null;

  log() {
    // if (!this.term.length) return;
    const stack = this.stack.toString();
    const term = this.term.map((f) => f.toString()).join(' ');
    const line = `${this.level}) ${stack}${term ? ` : ${term}` : ''}`;
    this.logs.push(line);
    console.log(line);
  }

  get current(): Interpreter {
    return this.subinterpreter ? this.subinterpreter : this;
  }

  get label() {
    return this.subinterpreter
      ? `${this.stack.toString()} ${this.subinterpreter.label}`
      : this.stack.toString();
  }

  isHalted() {
    return this.current.halted;
  }

  // No more factors in term and no subinterpreter
  isDone() {
    return !this.term.length && !this.subinterpreter && !this.syscalls.size;
  }

  // update(): gets called when:
  // - user runs a command in the terminal
  update(term: Term) {
    this.term = term;
    this.log();
  }

  step() {
    // check if there's a deeper level:
    if (this.subinterpreter) {
      // - if it's done, get rid of it after pushing the results onto the current stack
      if (this.subinterpreter.isDone()) {
        console.log(`${this.subinterpreter.level} is done`);
        const f = this.subinterpreter.stack.arr.shift();
        console.log('got', f);
        if (f) this.stack.push(f);

        const callback = this.subinterpreter.callbacks.next();

        if (callback) {
          console.log(`running ${this.subinterpreter.level}'s callback`);
          callback();
          return;
        }
        console.log(`clearing ${this.subinterpreter.level}`);
        this.logs.push(...this.subinterpreter.logs);
        this.subinterpreter = null;
        this.log();
        return;
      }
      // - otherwise, run the deeper level first
      this.subinterpreter.step();
      return;
    }

    if (this.term.length) {
      const factor = this.term.shift() as Factor;
      try {
        factor.validate(this.stack);
        factor.execute({
          stack: this.stack,
          syscall: this.syscall.bind(this),
          exec: this.exec.bind(this),
        });
        this.log();
      } catch (err) {
        // this.halted = true;
        console.log('intepreter: error');
        throw err;
      }
    }
  }

  takeAction() {
    const action = this.current.syscalls.next();
    if (!action) return null;
    this.current.halted = false;
    return action;
  }

  syscall(action: IAction) {
    console.log('queuing syscall');
    this.halted = true;
    this.syscalls.add(action);
  }

  exec(term: Term, callback?: () => void) {
    console.log(`exec: running ${term.toString()}`);
    this.subinterpreter = new Interpreter();
    this.subinterpreter.level = this.level + 1;
    this.subinterpreter.update(term);
    console.log('sub', this.subinterpreter);
    if (callback) {
      this.subinterpreter.callbacks.add(callback);
    }
  }

  sysret(factor?: Factor) {
    if (factor) this.current.stack.push(factor);
    this.current.halted = false;
  }
}
