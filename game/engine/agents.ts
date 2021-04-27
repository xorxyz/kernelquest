import { Points, Vector } from '../../lib/math';
import { Stack } from '../../lib/stack';
import { Queue } from '../../lib/queue';
import { Compiler, IProgram, RuntimeError } from './language';
import { Equipment, Item, Program, Thing } from './things';
import { Action, NoAction } from './actions';
import { DataStack, Room } from './world';
import { debug } from '../../lib/logging';

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

  load(dict: Dict<Program>) {
    this.dict = dict;
  }

  start(stack: DataStack) {
    this.stacks = [stack];

    this.program.transforms.map((transform) =>
      transform.fn.call(this, this.stack));

    return this.stack.peek();
  }
}

export abstract class AgentType {
  abstract appearance: string
}

export class Agent {
  tick: number = 0

  name: string
  type: AgentType
  position: Vector = new Vector()
  velocity: Vector = new Vector()
  view: Room

  hp = new HP()
  sp = new SP()
  mp = new MP()
  gp = new GP()

  private local: Room = new Room(0, 0)
  private queue: Queue<Action> = new Queue()
  private stack: Stack<Thing> = new Stack()
  private compiler: Compiler = new Compiler()
  private inventory: Array<Item | Equipment> = []

  constructor(type: AgentType) {
    this.type = type;
  }

  get isAlive() { return this.hp.value > 0; }

  render() {
    return this.type?.appearance || 'XX';
  }

  teleport(x: number, y: number, room?: Room) {
    this.position.setXY(x, y);
    if (room) this.view = room;
  }

  give(item: Item|Equipment) {
    this.inventory.push(item);
  }

  schedule(action: Action) {
    this.queue.add(action);
  }

  takeTurn(tick: number) {
    this.tick = tick;
    const action = this.queue.next();

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

export class Prince extends AgentType {
  appearance = '👼'
}
export class Princess extends AgentType {
  appearance = '👼'
}
export class Sage extends AgentType {
  appearance = '👼'
}
export class Dragon extends AgentType {
  appearance = '👼'
}

export class Deity extends Agent {
  type: Prince | Princess | Sage | Dragon
}

export class Cherub extends AgentType {
  appearance = '👼'
}

export class Fairy extends AgentType {
  appearance = '👼'
}
export class Elf extends AgentType {
  appearance = '👼'
}
export class Wizard extends AgentType {
  appearance = '👼'
}

export class Hero extends Agent {
  type: Cherub | Fairy | Elf | Wizard

  experience: number = 0
  get level() { return 1; }
}

export class Critter extends AgentType {
  appearance = '👼'
}
export class Person extends AgentType {
  appearance = '👼'
}

export class NPC extends Agent {
  type: Critter | Person
}

export class Monster extends AgentType {
  appearance = '👼'
}
export class Boss extends AgentType {
  appearance = '👼'
}

export class Enemy extends Agent {
  type: Monster | Boss
}
