import { Interpretation, Interpreter, Compiler, Factor } from 'xor4-interpreter';
import { Queue } from 'xor4-lib/queue';
import { Stack } from 'xor4-lib/stack';
import { Action } from './action';
import words from './words';

/** @category Mind */
interface Observation {
  tick: number,
  message: string
}

/** @category Mind */
export class Mind {
  public queue: Queue<Action> = new Queue<Action>();
  public stack: Stack<Factor> = new Stack();
  private interpreter: Interpreter;
  public memory: Array<Observation> = [];
  public tick: number = 0;

  constructor() {
    const compiler = new Compiler(words);

    this.interpreter = new Interpreter(compiler, this.stack);
  }

  interpret(line: string): Interpretation | Error {
    const result = this.interpreter.interpret(line, this.queue);

    return result;
  }

  update(tick) {
    this.tick = tick;
  }
}
