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
    const line = `${this.stack.toString()} : ${this.term.map((f) => f.toString()).join(' ')}`;
    console.log(`${this.level})${line}`);
    this.logs.push(line);
  }

  get current(): Interpreter {
    return this.subinterpreter ? this.subinterpreter : this;
  }

  isHalted() {
    return this.current.halted;
  }

  // No more factors in term and no subinterpreter
  isDone() {
    return !this.term.length && !this.subinterpreter;
  }

  // update(): gets called when:
  // - user runs a command in the terminal
  update(term: Term) {
    this.term = term;
    this.log();
  }

  step() {
    console.log(this.level, 'step');
    // check if there's a deeper level:
    if (this.subinterpreter) {
      // - if it's done, get rid of it after pushing the results onto the current stack
      if (this.subinterpreter.isDone()) {
        console.log('sub is done');
        const result = this.subinterpreter.stack.pop();
        if (result) this.stack.push(result);

        const callback = this.subinterpreter.callbacks.next();

        if (callback) {
          callback();
          return;
        }
        console.log('removing sub', this.subinterpreter.level);
        this.subinterpreter = null;
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
        this.halted = true;
        throw err;
      }
    }
  }

  syscall(action: IAction) {
    console.log('queuing syscall');
    this.halted = true;
    this.syscalls.add(action);
  }

  exec(term: Term, callback?: () => void) {
    console.log(`exec: running ${term.toString()}`);
    this.subinterpreter = new Interpreter();
    this.subinterpreter.update(term);
    this.subinterpreter.level = this.level + 1;
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
