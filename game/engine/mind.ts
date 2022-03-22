import { Interpretation, Interpreter } from 'xor4-interpreter';
import { Compiler } from 'xor4-interpreter/compiler';
import { Factor } from 'xor4-interpreter/types';
import { Queue } from 'xor4-lib/queue';
import { Stack } from 'xor4-lib/stack';
import { goto, create } from '../lib/words';
import { Action } from './actions';

interface Observation {
  tick: number,
  message: string
}

export class Mind {
  public queue: Queue<Action> = new Queue<Action>();
  public stack: Stack<Factor> = new Stack();
  private interpreter: Interpreter;
  public memory: Array<Observation> = [];
  private tick: number = 0;

  constructor() {
    const compiler = new Compiler({
      goto,
      create,
    });

    this.interpreter = new Interpreter(compiler, this.stack);
  }

  interpret(line: string): Interpretation | Error {
    const result = this.interpreter.interpret(line, this.queue);
    if (result instanceof Error) {
      this.memory.push({
        tick: this.tick,
        message: result.message,
      });
    }
    return result;
  }

  update(tick) {
    this.tick = tick;
  }
}
