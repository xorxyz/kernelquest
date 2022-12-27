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

    if (this.interpreter.isWaiting() || this.interpreter.isBusy()) {
      return {
        name: 'think',
      };
    }

    return {
      name: 'noop',
    };
  }

  pullDialog() {
    return 'Man: Hi! My name is Adam.\nWhat is your name?\n';
  }
}
