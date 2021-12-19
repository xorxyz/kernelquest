import { Points, Vector } from '../../lib/math';
import { Stack } from '../../lib/stack';
import { Queue } from '../../lib/queue';
import { Equipment, Item } from './things';
import { Action } from './actions';
import { Cell, Room } from './world';
import { debug } from '../../lib/logging';
import { Compiler } from '../../interpreter/compiler';
import { Colors, esc } from '../../lib/esc';
import { Interpretation } from '../../interpreter';
import { Factor } from '../../interpreter/types';
import { RuntimeError } from '../../_deprecated/files/language';

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
  name: string = ''
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
  stack: Stack<Factor> = new Stack()
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
    return this.position.clone().add(this.direction);
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
    const term = this.compiler.compile(code);
    const execution = new Interpretation(term);

    try {
      const result = execution.run(this.stack);
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
  appearance = esc(Colors.Bg.White) + esc(Colors.Fg.Black) + 'AA'
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

