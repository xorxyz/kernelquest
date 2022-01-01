import { getRandomDirection, Points, Vector } from 'xor4-lib/math';
import { Stack } from 'xor4-lib/stack';
import { Queue } from 'xor4-lib/queue';
import { debug } from 'xor4-lib/logging';
import { Colors, esc } from 'xor4-lib/esc';
import { Compiler } from 'xor4-interpreter/compiler';
import { Interpretation } from 'xor4-interpreter';
import { Factor } from 'xor4-interpreter/types';
import { Equipment, Item } from './things';
import { Action, MoveAction } from './actions';
import { Cell, Room } from './world';

export abstract class RuntimeError extends Error {}

export class HP extends Points {}
export class SP extends Points {}
export class MP extends Points {}
export class GP extends Points {}

export abstract class AgentType {
  abstract appearance: string
  abstract name: string
  abstract capabilities: Array<Capability>
}

export class Agent {
  cycle: number = 0;
  name: string = '';
  type: AgentType;
  room: Room;
  cell: Cell;
  position: Vector = new Vector(0, 0);
  direction: Vector = new Vector(1, 0);
  velocity: Vector = new Vector(0, 0);
  hp = new HP();
  sp = new SP();
  mp = new MP();
  gp = new GP();
  holding: Item | null = null;
  private queue: Queue<Action> = new Queue();
  private stack: Stack<Factor> = new Stack();
  private compiler: Compiler = new Compiler();
  private inventory: Array<Item | Equipment> = [];

  constructor(type: AgentType) {
    this.type = type;

    type.capabilities.forEach((cap) => {
      cap.bootstrap(this.queue);
    });
  }

  get isAlive() {
    return this.hp.value > 0;
  }

  render() {
    return this.type.appearance;
  }

  looksAt() {
    return this.position.clone().add(this.direction);
  }

  enter(room: Room) {
    this.room = room;
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
  appearance = '👼';
  name = 'cherub';
  capabilities = [];
}
export class Fairy extends AgentType {
  appearance = '🧚';
  name = 'fairy';
  capabilities = [];
}
export class Elf extends AgentType {
  appearance = '🧝';
  name = 'elf';
  capabilities = [];
}
export class Wizard extends AgentType {
  appearance = '🧙';
  name = 'wizard';
  capabilities = [];
}

export class CursorAgentType extends AgentType {
  appearance = `${esc(Colors.Bg.White) + esc(Colors.Fg.Black)}AA`;
  name = 'cursor';
  capabilities = [];
}

export class Hero extends Agent {
  type: Cherub | Fairy | Elf | Wizard = new Cherub();
  experience: number = 0;
  get level() { return 1; }
}

export class Cursor extends Agent {
  type: CursorAgentType = new CursorAgentType();
  cursor: null;
}

export abstract class NPC extends AgentType {}
export abstract class Friend extends AgentType {}
export abstract class Critter extends AgentType {}
export abstract class Foe extends AgentType {}

export class Generator extends Agent {
  n: number;
}

abstract class Capability {
  abstract bootstrap (queue: Queue<Action>): void
}

export class RandomWalkCapability extends Capability {
  delayMs: number;
  timer;

  constructor(delayMs: number = 1000) {
    super();
    this.delayMs = delayMs;
  }

  bootstrap(queue: Queue<Action>) {
    debug('bootstrap random walk');
    this.timer = setInterval(() => {
      const direction = getRandomDirection();

      queue.push(
        new MoveAction(direction),
      );
    }, this.delayMs);
  }
}

export class Sheep extends Critter {
  appearance = '🐑';
  name = 'sheep';
  capabilities = [new RandomWalkCapability()];
}
