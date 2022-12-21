import {
  Interpreter, Compiler, Factor, Dictionary,
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
  public tick = 0;
  public memory: Array<Observation> = [];
  public queue: Queue<IAction> = new Queue<IAction>();
  private compiler: Compiler;
  private interpreter: Interpreter;

  constructor(words?: Dictionary) {
    this.compiler = new Compiler(words);
    this.interpreter = new Interpreter();
  }

  get stack(): Stack<Factor> {
    return this.interpreter.currentInterpretation.stack;
  }

  sysret(factor: Factor) {
    this.interpreter.sysret(factor);
  }

  decide(): IAction | null {
    const next = this.interpreter.action
      ? this.interpreter.handleSyscall()
      : this.queue.next();

    if (next) return next;

    this.interpreter.step();

    return null;
  }

  interpret(line: string) {
    const term = this.compiler.compile(line);
    this.interpreter.exec(term);
  }

  compile(line: string) {
    return this.compiler.compile(line);
  }

  update(tick) {
    this.tick = tick;
  }
}
