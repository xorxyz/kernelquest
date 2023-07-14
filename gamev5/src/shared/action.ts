import { Agent } from './agent';
import { ActionArguments, IAction, SerializableType } from './interfaces';

export interface IActionContext {
  actor: Agent,
}

export type SUCCESS_ACTION_STATUS = 'success'

export type FAILURE_ACTION_STATUS = 'failure'

export type HistoryEventState = Record<string, SerializableType | Record<string, SerializableType>>

export interface IActionResult {
  status: SUCCESS_ACTION_STATUS | FAILURE_ACTION_STATUS
  message?: string
  state?: HistoryEventState
}

export interface IActionDefinition<
  T extends ActionArguments = ActionArguments,
  Z extends HistoryEventState = HistoryEventState
> {
  cost: number
  perform(ctx: IActionContext, arg: T): IActionResult
  undo(ctx: IActionContext, arg: T, previousState: Z): IActionResult
}

export interface HistoryEvent {
  tick: number,
  agentId: number,
  action: IAction,
  failed?: boolean,
  state?: HistoryEventState,
}
