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
  private compiler: Compiler;
  private interpreter: Interpreter;

  constructor(words?: Dictionary) {
    this.compiler = new Compiler(words);

    this.interpreter = new Interpreter(this.compiler, this.stack, this.queue);
  }

  decide() {
    if (this.queue.peek()) {
      return this.queue.next();
    }
    this.interpreter.next();
    return {
      name: 'noop',
    };
  }

  interpret(line: string): string | Error {
    const result = this.interpreter.step(line);

    debug(`interpret(${line}):`, result);

    return result;
  }

  update(tick) {
    this.tick = tick;
  }
}
