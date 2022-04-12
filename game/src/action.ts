import { Agent } from './agent';
import { Thing } from './thing';
import { Place } from './place';

/** @category Capability */
export abstract class Capability {
  abstract bootstrap (agent: Agent): void
  abstract run (agent: Agent, tick: number): void
}

/** @category Action */
export abstract class ActionResult {
  public message: string;
  constructor(message: string = '') {
    this.message = message;
  }
}
/** @category Action */
export class ActionSuccess extends ActionResult {}
/** @category Action */
export class ActionFailure extends ActionResult {}

/** @category Action */
export abstract class Action {
  abstract readonly name: string
  abstract readonly cost: number
  abstract perform(context: Place, subject: Agent, object?: Agent | Thing): ActionResult

  authorize(agent: Agent) {
    if (agent.sp.value - this.cost < 0) return false; // too expensive sorry
    agent.sp.decrease(this.cost);
    return true;
  }

  tryPerforming(ctx: Place, agent: Agent, object?: Agent | Thing): ActionResult {
    if (!this.authorize) return new ActionFailure('Not enough stamina.');
    const result = this.perform(ctx, agent, object);

    return result;
  }
}

/** @category Action */
export class NoAction extends Action {
  name = 'noop';
  cost = 0;
  perform() {
    return new ActionSuccess();
  }
}

/** @category Terminal Actions */
export abstract class TerminalAction extends Action {
  terminal;
  constructor(terminal) {
    super();
    this.terminal = terminal;
  }
}
