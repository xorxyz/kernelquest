import { debug } from 'xor4-lib';
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

export type ActionFn = (this: AgentAction,
  context: Area, subject: Agent, object?: Agent | Thing) => ActionResult
export type ActionParams = Record<string, any>

export type ActionsDict = Record<string, {
  cost: number,
  perform: ActionFn,
}>

export class AgentAction {
  name: string;
  cost: number;
  params: ActionParams;
  perform: ActionFn;

  constructor(name: string, params: ActionParams, actions: ActionsDict) {
    const action = actions[name];

    if (!action) {
      debug(actions);
      throw new Error(`Failed to create action '${name}': action not found`);
    }

    this.name = name;
    this.params = params;
    this.cost = action.cost;
    this.perform = action.perform;
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

    agent.remember({
      tick: agent.mind.tick,
      message: result.message,
    });

    return result;
  }
}

/** @category Action */
export abstract class Action {
  abstract readonly name: string
  abstract readonly cost: number

  abstract perform(context: Area, subject: Agent, object?: Agent | Thing): ActionResult

  authorize(agent: Agent) {
    if (agent.sp.value - this.cost < 0) return false; // too expensive sorry
    agent.sp.decrease(this.cost);
    return true;
  }

  tryPerforming(ctx: Area, agent: Agent, object?: Agent | Thing): ActionResult {
    if (!this.authorize) return new ActionFailure('Not enough stamina.');
    const result = this.perform(ctx, agent, object);

    debug('tryPerforming() -> result', result);

    agent.remember({
      tick: agent.mind.tick,
      message: result.message,
    });

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
