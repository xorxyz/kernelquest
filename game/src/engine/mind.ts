import {
  Compiler, Dictionary,
} from '../interpreter';
import {
  Interpreter,
} from '../interpreter/interpreter2';
import { Queue } from '../shared';
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

  think() {
    // step through program until you reach a syscall or there is nothing left to evaluate
    while (!this.interpreter.isHalted() && !this.interpreter.isDone()) {
      this.interpreter.step();
    }
  }
}
