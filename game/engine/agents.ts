import { Points, Vector } from '../../lib/math';
import { Stack } from '../../lib/stack';
import { Queue } from '../../lib/queue';
import { Execution, IProgram, RuntimeError } from './language';
import { Equipment, Item, Program, Thing } from './things';
import { Action, NoAction } from './actions';
import { Cell, DataStack, Room } from './world';
import { debug } from '../../lib/logging';
import { Compiler } from './compiler';
import { Colors, esc, Style } from '../../lib/esc';

export class HP extends Points {}
export class SP extends Points {}
export class MP extends Points {}
export class GP extends Points {}

export abstract class AgentType {
  abstract appearance: string
  abstract name: string
}

export class Agent {
  cycle: number = 0
  name: string
  type: AgentType
  room: Room
  cell: Cell
  position: Vector = new Vector(0, 0)
  direction: Vector = new Vector(1, 0)
  velocity: Vector = new Vector(0, 0)
  hp = new HP()
  sp = new SP()
  mp = new MP()
  gp = new GP()
  holding: Item | null = null
  private queue: Queue<Action> = new Queue()
  private stack: Stack<Thing> = new Stack()
  private compiler: Compiler = new Compiler()
  private inventory: Array<Item | Equipment> = []

  constructor(type: AgentType) {
    this.type = type;
  }

  get isAlive() { return this.hp.value > 0; }

  render() {
    return this.type.appearance;
  }

  looksAt () {
    return this.cell.position.clone();
  }

  enter (room: Room) {
    this.room = room
  }

  give(item: Item|Equipment) {
    this.inventory.push(item);
  }

  schedule(action: Action) {
    this.queue.add(action);
  }

  takeTurn(cycle: number): Action | null {
    this.cycle = cycle;
    const action = this.queue.next();

    return action;
  }

  exec(code: string) {
    const program = this.compiler.compile(code);
    const execution = new Execution(program);

    try {
      const result = execution.start(this.stack);
      debug(result);
    } catch (err) {
      if (!(err instanceof RuntimeError)) {
        console.error('Unhandled error:', err);
      }
    }

    return execution;
  }
}

export class Cherub extends AgentType {
  appearance = '👼'
  name = 'cherub'
}
export class Fairy extends AgentType {
  appearance = '🧚'
  name = 'fairy'
}
export class Elf extends AgentType {
  appearance = '🧝'
  name = 'elf'
}
export class Wizard extends AgentType {
  appearance = '🧙'
  name = 'wizard'
}

export class CursorAgentType extends AgentType {
  appearance = esc(Colors.Bg.White)
  name = 'cursor'
}

export class Hero extends Agent {
  type: Cherub | Fairy | Elf | Wizard
  experience: number = 0
  get level() { return 1; }
}

export class Cursor extends Agent {
  type: CursorAgentType
  cursor: null
}

export abstract class Critter extends AgentType {}
export abstract class NPC extends AgentType {}
export abstract class Monster extends AgentType {}
export abstract class Boss extends AgentType {}

export class Sheep extends Critter {
  appearance = '🐑'
  name = 'sheep'
}

export class Generator extends Agent {
  n: number

}

