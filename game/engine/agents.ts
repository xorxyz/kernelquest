import { Points, Vector } from 'xor4-lib/math';
import { Stack } from 'xor4-lib/stack';
import { Queue } from 'xor4-lib/queue';
import { debug } from 'xor4-lib/logging';
import { Colors, esc } from 'xor4-lib/esc';
import { Compiler } from 'xor4-interpreter/compiler';
import { Interpretation } from 'xor4-interpreter';
import { Factor } from 'xor4-interpreter/types';
import { Thing } from './things';
import { Action } from './actions';
import { Cell } from './cell';

export abstract class RuntimeError extends Error {}

export class HP extends Points {}
export class SP extends Points {}
export class MP extends Points {}
export class GP extends Points {}

export abstract class AgentType {
  abstract name: string
  appearance: string = '@@';
  capabilities: Array<Capability> = [];
}

export class Mind {
  private stack: Stack<Factor> = new Stack();
  private compiler: Compiler = new Compiler();

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

export class Body {
  public position: Vector = new Vector(0, 0);
  public direction: Vector = new Vector(1, 0);
  public velocity: Vector = new Vector(0, 0);

  get isLookingAt() {
    return this.position.clone().add(this.direction);
  }
}

export class Agent {
  public name: string = 'anon';

  public type: AgentType;
  public body: Body;
  public mind: Mind;

  public hp = new HP();
  public sp = new SP();
  public mp = new MP();
  public gp = new GP();

  private cell: Cell | null = null;
  private holding: Thing | null = null;
  private queue: Queue<Action> = new Queue();

  constructor(type: AgentType) {
    this.type = type;
    this.body = new Body();
    this.mind = new Mind();

    type.capabilities.forEach((cap) => {
      cap.bootstrap(this.queue);
    });
  }

  get isAlive() {
    return this.hp.value > 0;
  }

  get holds() {
    return this.holding;
  }

  hasHandle(cell: Cell) {
    return this.cell === cell;
  }

  handleCell(cell: Cell | null) {
    this.cell = cell;
  }

  get(): boolean {
    if (this.holding || !this.cell) return false;
    this.holding = this.cell.take();
    return true;
  }

  drop(): boolean {
    if (!this.holding || !this.cell || this.cell.isBlocked) return false;

    this.cell.put(this.holding);
    this.holding = null;

    return true;
  }

  render() {
    return this.type.appearance;
  }

  schedule(action: Action) {
    this.queue.add(action);
  }

  takeTurn(): Action | null {
    const action = this.queue.next();

    return action;
  }
}

export class CursorAgentType extends AgentType {
  appearance = `${esc(Colors.Bg.White) + esc(Colors.Fg.Black)}AA`;
  name = 'cursor';
  capabilities = [];
}

export class Hero extends Agent {
  experience: number = 0;
  get level() { return 1; }
}

export class Cursor extends Agent {
  type: CursorAgentType = new CursorAgentType();
  cursor: null;
}

export abstract class NPC extends AgentType {}

export abstract class Friend extends AgentType {}

export abstract class Foe extends AgentType {}

export class Generator extends Agent {
  n: number;
}

export abstract class Capability {
  abstract bootstrap (queue: Queue<Action>): void
}
