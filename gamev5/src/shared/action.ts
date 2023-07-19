import { Agent } from './agent';
import { Area } from './area';
import { ActionArguments, HistoryEventState, IActionResult } from './interfaces';

export interface IActionContext {
  agent: Agent,
  area: Area
}

export interface IActionDefinition<
  T extends ActionArguments = ActionArguments,
  Z extends HistoryEventState = HistoryEventState
> {
  cost: number
  perform(ctx: IActionContext, arg: T): IActionResult
  undo(ctx: IActionContext, arg: T, previousState: Z): IActionResult
}
