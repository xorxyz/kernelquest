import { Interpretation, Interpreter, Compiler, Factor, Dictionary } from 'xor4-interpreter';
import { debug, Queue, Stack } from 'xor4-lib';
import { IAction } from '../lib/actions.v2';
import { Area } from './area';
import { World } from './world';

/** @category Mind */
export interface Observation {
  tick: number,
  message: string
}

/** @category Mind */
export class Mind {
  public tick: number = 0;
  private worlds: Record<string, World> = {};
  public memory: Array<Observation> = [];
  public queue: Queue<IAction> = new Queue<IAction>();
  public stack: Stack<Factor> = new Stack();
  private interpreter: Interpreter;

  constructor(words?: Dictionary) {
    const compiler = new Compiler(words);

    this.worlds.me = new World([]);
    this.interpreter = new Interpreter(compiler, this.stack);
  }

  interpret(line: string): Interpretation | Error {
    const result = this.interpreter.interpret(line, this.queue);

    debug(`interpret(${line}):`, result);

    return result;
  }

  update(tick) {
    this.tick = tick;
    this.worlds.me.tick = tick;
  }
}
