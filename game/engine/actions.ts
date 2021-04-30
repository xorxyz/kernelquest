import { debug } from '../../lib/logging';
import { Vector } from '../../lib/math';
import { Terminal } from '../ui/terminal';
import { Agent, AgentType, Critter, NPC } from './agents';
import { bounds } from './constants';
import { Room } from './world';

export abstract class ActionResult {}
export class ActionSuccess extends ActionResult {}
export class ActionFailure extends ActionResult {}

export abstract class Action {
  abstract cost: number
  abstract perform(agent: Agent, room: Room): ActionResult

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
  constructor (terminal: Terminal) {
    super();
    this.terminal = terminal;
  }
  perform() {
    this.terminal.switchModes();
    return new ActionSuccess();
  }
}

abstract class MoveAction extends Action {
  cost: 5
  abstract direction: Vector
  perform(agent: Agent) {
    if (agent.velocity.opposes(this.direction) ||
        agent.velocity.isZero()) {
      agent.direction = this.direction;
      agent.velocity.add(this.direction);
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class MoveNorthAction extends MoveAction {
  direction = new Vector(0, -1)
}
export class MoveEastAction extends MoveAction {
  direction = new Vector(1, 0)
}
export class MoveSouthAction extends MoveAction {
  direction = new Vector(0, 1)
}
export class MoveWestAction extends MoveAction {
  direction = new Vector(-1, 0)
}

export class RotateAction extends Action {
  cost: 1
  perform(agent: Agent) {
    agent.direction.rotate();

    return new ActionSuccess();
  }
}

export class SpawnAction extends Action {
  cost: 0
  type: AgentType
  constructor (type: AgentType) {
    super();
    this.type = type;
  }
  perform(agent: Agent, room: Room) {
    const spawned = new Agent(this.type);
    spawned.position.copy(agent.position).add(agent.direction);
    if (!bounds.contains(spawned.position)) {
      return new ActionFailure();
    }
    room.add(spawned);
    return new ActionSuccess();
  }
}
