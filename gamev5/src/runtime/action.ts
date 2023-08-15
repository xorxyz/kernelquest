import { Agent } from './agent';
import { Area } from '../shared/area';
import { ActionArguments, HistoryEventState, IActionResult } from '../shared/interfaces';

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
