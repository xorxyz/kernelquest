import {
  Interpreter, Compiler, Factor, Dictionary, Quotation,
} from '../interpreter';
import { Queue, Stack } from '../shared';
import { IAction } from './actions';

/** @category Mind */
export interface Observation {
  tick: number,
  message: string
}

/** @category Mind */
export class Mind {
  tick = 0;
  memory: Array<Observation> = [];
  queue: Queue<IAction> = new Queue<IAction>();
  compiler: Compiler;
  interpreter: Interpreter;

  constructor(words?: Dictionary) {
    this.compiler = new Compiler(words);
    this.interpreter = new Interpreter();
  }

  get stack() {
    return this.interpreter.stack;
  }

  update(tick) {
    this.tick = tick;
  }

  decide(): IAction {
    const syscall = this.interpreter.takeAction();
    if (syscall) {
      return syscall;
    }

    const next = this.queue.next();
    if (next) return next;

    while (this.interpreter.isBusy() && !this.interpreter.isWaiting()) {
      this.interpreter.step();
    }

    if (this.interpreter.isWaiting()) {
      return {
        name: 'think',
      };
    }

    // if (this.interpreter.isBusy()) {
    //   while (!this.interpreter.isWaiting()) {
    //     this.interpreter.step();
    //   }

    //   return {
    //     name: 'think',
    //   };
    // }

    return {
      name: 'noop',
    };
  }
}
