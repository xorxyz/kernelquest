import { Agent } from './agent';
import { Thing } from './thing';
import { Place } from './place';

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

  tryPerforming(ctx: Place, agent: Agent, object?: Agent | Thing): ActionResult {
    if (!this.authorize) return new ActionFailure('Not enough stamina.');
    const result = this.perform(ctx, agent, object);

    if (result instanceof ActionFailure && result.message) {
      agent.logs.push({
        tick: agent.mind.tick,
        message: `${result.message}`,
      });
    }

    return result;
  }
}

export class NoAction extends Action {
  name = 'noop';
  cost = 0;
  perform() {
    return new ActionSuccess();
  }
}
