import {
  Compiler, Dictionary, Interpreter, LiteralTruth,
} from '../interpreter';
import combinators from '../interpreter/combinators';
import operators, { Operator } from '../interpreter/operators';
import { Queue } from '../shared';
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
  dict: Dictionary;
  memory: Array<Observation> = [];
  queue: Queue<IAction> = new Queue<IAction>();
  compiler: Compiler;
  interpreter: Interpreter;
  model = new MentalModel();

  constructor() {
    this.dict = {
      ...operators,
      ...combinators,
      ...words,
      true: new LiteralTruth(true),
      false: new LiteralTruth(false),
      help: new Operator(['help'], [], () => {
        throw new Error(`Available words: ${Object.keys(this.dict).sort().join(', ')}.\n`);
      }),
    };
    this.compiler = new Compiler(this.dict);
    this.interpreter = new Interpreter(this.dict);
  }

  get stack() {
    return this.interpreter.stack;
  }

  update(tick) {
    this.tick = tick;
  }

  log(message: string) {
    this.memory.push({
      message,
      tick: this.tick,
    });
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
