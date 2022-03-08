import { Agent } from './agents';
import { Thing } from './things';
import { Place } from './places';

export abstract class ActionResult {
  public message: string;
  constructor(message: string = '') {
    this.message = message;
  }
}
export class ActionSuccess extends ActionResult {}
export class ActionFailure extends ActionResult {}

export abstract class Action {
  abstract readonly name: string
  abstract readonly cost: number
  abstract perform(context: Place, subject: Agent, object?: Agent | Thing): ActionResult

  authorize(agent: Agent) {
    if (agent.sp.value - this.cost < 0) return false; // too expensive sorry
    agent.sp.decrease(this.cost);
    return true;
  }

  tryPerforming(ctx: Place, subject: Agent, object?: Agent | Thing) {
    if (!this.authorize) return new ActionFailure('Not enough stamina.');
    return this.perform(ctx, subject, object);
  }
}

export class NoAction extends Action {
  name = 'noop';
  cost = 0;
  perform() {
    return new ActionSuccess();
  }
}
