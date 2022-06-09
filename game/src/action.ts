import { debug } from 'console';
import { Thing } from './thing';
import { Area } from './area';
import { Agent } from './agent';

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

export interface IAction {
  name: string
  cost: number
}

/** @category Action */
export abstract class Action implements IAction {
  abstract readonly name: string
  abstract readonly cost: number

  abstract perform(context: Area, subject: Agent, object?: Agent | Thing): ActionResult

  serialize(): IAction {
    return {
      name: this.name,
      cost: this.cost,
    };
  }

  authorize(agent: Agent) {
    if (agent.sp.value - this.cost < 0) return false; // too expensive sorry
    agent.sp.decrease(this.cost);
    return true;
  }

  tryPerforming(ctx: Area, agent: Agent, object?: Agent | Thing): ActionResult {
    if (!this.authorize) return new ActionFailure('Not enough stamina.');
    const result = this.perform(ctx, agent, object);

    debug('tryPerforming() -> result', result);

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
