import { Interpretation, Interpreter, Compiler, Factor, Dictionary } from 'xor4-interpreter';
import { debug, FSM, Queue, Stack } from 'xor4-lib';
import { Action } from './action';
import { World } from './world';

export function createMindMachine() {
  return new FSM('thinking', {
    thinking: {
      stop: 'listening',
    },
    remembering: {
      stop: 'thinking',
    },
    imagining: {
      stop: 'thinking',
    },
  });
}

export function createBodyMachine() {
  return new FSM('listening', {
    halted: {
      reset: 'listening',
    },
    listening: {
      error: 'halted',
      sleep: 'sleeping',
      wait: 'waiting',
      go: 'walking',
      look: 'looking',
    },
    waiting: {
      stop: 'listening',
    },
    looking: {
      stop: 'listening',
    },
    sleeping: {
      stop: 'listening',
    },
    walking: {
      stop: 'listening',
    },
  });
}

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
  public queue: Queue<Action> = new Queue<Action>();
  public stack: Stack<Factor> = new Stack();
  private interpreter: Interpreter;
  private state: FSM;

  constructor(words?: Dictionary, thinking?: boolean) {
    const compiler = new Compiler(words);

    this.state = createBodyMachine();

    if (thinking) {
      this.state.event('think', createMindMachine());
    }

    this.worlds.me = new World([]);
    this.interpreter = new Interpreter(compiler, this.stack);
  }

  static from(serialized: string) {
    return new Mind();
  }

  serialize() {
    return {

    };
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
