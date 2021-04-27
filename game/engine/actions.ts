import { Vector } from '../../lib/math';
import { Terminal } from '../shell/terminal';
import { Agent } from './agents';

export abstract class ActionResult {}
export class ActionSuccess extends ActionResult {}
export class ActionFailure extends ActionResult {}

export abstract class Action {
  abstract perform(): ActionResult
}

export class NoAction {
  perform() {
    return new ActionSuccess();
  }
}

export class SwitchModeAction {
  terminal: Terminal
  constructor(terminal: Terminal) {
    this.terminal = terminal;
  }
  perform() {
    this.terminal.switchModes();
    return new ActionSuccess();
  }
}

export class MoveAction {
  agent: Agent
  direction: Vector
  constructor(agent: Agent, x: number, y: number) {
    this.agent = agent;
    this.direction = new Vector(x, y);
  }
  perform() {
    this.agent.position.add(this.direction);
    return new ActionSuccess();
  }
}
