import { Vector } from '../../lib/math';
import { Terminal } from '../ui/terminal';
import { Agent } from './agents';

export abstract class ActionResult {}
export class ActionSuccess extends ActionResult {}
export class ActionFailure extends ActionResult {}

export abstract class Action {
  abstract cost: number
  abstract perform(): ActionResult

  authorize(agent: Agent) {
    if (agent.sp.value - this.cost < 0) return false; // too expensive sorry
    return true;
  }
}

export class NoAction extends Action {
  cost: 0
  perform() {
    return new ActionSuccess();
  }
}

export class SwitchModeAction extends Action {
  cost: 0
  terminal: Terminal
  constructor(terminal: Terminal) {
    super();
    this.terminal = terminal;
  }
  perform() {
    this.terminal.switchModes();
    return new ActionSuccess();
  }
}

export class MoveAction extends Action {
  cost: 5
  agent: Agent
  direction: Vector
  constructor(agent: Agent, x: number, y: number) {
    super();
    this.agent = agent;
    this.direction = new Vector(x, y);
  }
  perform() {
    if (this.agent.velocity.opposes(this.direction) ||
        this.agent.velocity.isZero()) {
      this.agent.velocity.add(this.direction);
      this.agent.velocity.sub(this.agent.velocity);
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class RotateAction extends Action {
  cost: 1
  agent: Agent
  constructor(agent: Agent) {
    super();
    this.agent = agent;
  }
  perform() {
    this.agent.direction.rotate();

    return new ActionSuccess();
  }
}

export class WalkAction extends Action {
  cost: 10
  agent: Agent
  direction: Vector
  constructor(agent: Agent, x:number, y:number) {
    super();
    this.agent = agent;
    this.direction = new Vector(x, y);
  }
  perform() {
    this.agent.velocity.copy(this.direction);

    return new ActionSuccess();
  }
}
