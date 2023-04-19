import { Compiler, Interpreter } from '../interpreter';
import { Queue } from '../shared';
import Graph from '../shared/graph';
import { Graphv2 } from '../shared/graphv2';
import { IAction } from './actions';
import words from './words';

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
  model = new MentalModel();

  constructor() {
    this.compiler = new Compiler(words);
    this.interpreter = new Interpreter(this.compiler.dict);
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

  takeAction() {
    const action = this.interpreter.current.syscalls.next();
    if (!action) return null;
    this.interpreter.current.halted = false;
    return action;
  }
}

class MentalModel {
  graph = new Graphv2();
}
