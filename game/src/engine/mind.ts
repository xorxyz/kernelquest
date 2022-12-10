import {
  Interpretation, Interpreter, Compiler, Factor, Dictionary,
} from '../interpreter';
import { debug, Queue, Stack } from '../shared';
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
  public stack: Stack<Factor> = new Stack();
  private interpreter: Interpreter;

  constructor(words?: Dictionary) {
    const compiler = new Compiler(words);

    this.interpreter = new Interpreter(compiler, this.stack);
  }

  interpret(line: string): Interpretation | Error {
    const result = this.interpreter.interpret(line, this.queue);

    debug(`interpret(${line}):`, result);

    return result;
  }

  update(tick) {
    this.tick = tick;
  }
}
