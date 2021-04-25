import { Points, Vector } from '../lib/math';
import { Stack } from '../lib/stack';
import { Queue } from '../lib/queue';
import { Compiler, IProgram, RuntimeError } from './language';
import { Equipment, Item, Program, Thing } from './things';
import { Action, NoAction } from './actions';
import { DataStack, Room } from './vm';

export class HP extends Points {}
export class SP extends Points {}
export class MP extends Points {}
export class GP extends Points {}

export type Name = string
export type Dict<T> = Record<Name, T>

export class Execution {
  private level = 0
  private stacks: Array<any>
  private program: IProgram
  private dict: Dict<Program>

  constructor(program: IProgram) {
    this.program = program;
  }

  get stack() {
    return this.stacks[this.level];
  }

  set stack(s) {
    this.stacks[this.level] = s;
  }

  load(dict: Dict<Program>) {
    this.dict = dict;
  }

  start(stack: DataStack) {
    this.stacks = [stack];

    this.program.transforms.map((transform) =>
      transform.fn.call(this, this.stack, this.dict));

    return this.stack.peek();
  }
}

export abstract class AgentType {}

export class Agent {
  name: string
  type: AgentType
  position: Vector = new Vector()
  velocity: Vector = new Vector()

  hp = new HP()
  sp = new SP()
  mp = new MP()

  gp = new GP()

  get isAlive() { return this.hp.value > 0; }

  private local: Room = new Room(0, 0)
  private queue: Queue<Action> = new Queue()
  private stack: Stack<Thing> = new Stack()
  private compiler: Compiler = new Compiler()
  private inventory: Set<Item | Equipment> = new Set()

  schedule(action: Action) {
    this.queue.add(action);
  }

  takeTurn() {
    const action = new NoAction();

    return action;
  }

  exec(code: string) {
    const program = this.compiler.compile(code);
    const execution = new Execution(program);

    try {
      execution.start(this.stack);
    } catch (err) {
      if (!(err instanceof RuntimeError)) {
        console.error('Unhandled error:', err);
      }
    }

    return true;
  }
}

export class Cherub extends AgentType {}
export class Fairy extends AgentType {}
export class Elf extends AgentType {}
export class Wizard extends AgentType {}

export class Hero extends Agent {
  type: Cherub | Fairy | Elf | Wizard

  experience: number = 0
  get level() { return 1; }
}

export class Critter extends AgentType {}
export class Healer extends AgentType {}
export class Shopkeeper extends AgentType {}

export class NPC extends Agent {
  type: Critter| Healer | Shopkeeper
}

export class Bug extends AgentType {}
export class Monster extends AgentType {}

export class Enemy extends Agent {
  type: Bug | Monster
}
