import * as v from '@badrap/valita';
import { Agent } from './agent';
import { Area } from '../shared/area';
import {
  ActionArguments, ActionResultType, GameEventState, IActionResult,
} from '../shared/interfaces';
import { IGameState } from '../state/valid_state';
import { Process } from '../os/kernel/process';

export interface IActionContext {
  agent: Agent,
  area: Area,
  shell: Process,
  state: IGameState
}

export interface IActionValidator {
  name: string,
  args: ActionArguments,
}

export function succeed(m?: string, s?: GameEventState): IActionResult;

export function succeed(state: GameEventState): IActionResult;

export function succeed(
  a?: string | GameEventState, b?: GameEventState,
): IActionResult {
  if (typeof a === 'string') {
    return {
      type: ActionResultType.SUCCESS,
      message: a,
      state: b,
    };
  }

  return {
    type: ActionResultType.SUCCESS,
    state: a,
  };
}

export const fail = (message: string): IActionResult => ({
  type: ActionResultType.FAILURE,
  message,
});

const noopFn = (): IActionResult => succeed();

export interface IActionDefinition<
  A extends IActionValidator
> {
  validator: v.ObjectType

  perform(ctx: IActionContext, args: A['args']): IActionResult

  undo(ctx: IActionContext, args: A['args'], previousState: GameEventState): IActionResult
}

type ActionDefinitionReturnType<
  T extends string, A extends ActionArguments
> = [
  { name: T; args: A },
  IActionDefinition<{ name: T; args: A; }>
];

export interface ICreateActionDefinitionParams<
  T extends string, A extends ActionArguments
> {
  name: T,
  args?: v.Type<A>,
  state?: v.Type<GameEventState>,
  perform?: (ctx: IActionContext, args: A) => IActionResult,
  undo?: (ctx: IActionContext, args: A, state: GameEventState) => IActionResult,
}

export function createActionDefinition<
T extends string, A extends ActionArguments
>({
  name, args, state, perform, undo,
}: ICreateActionDefinitionParams<T, A>): ActionDefinitionReturnType<T, A> {
  const validator = v.object({
    name: v.literal(name),
    args: args ?? v.object({ _no_args: v.string().optional() }),
    // state: state ?? v.object({ _no_state: v.string().optional() }),
  });

  const actionInterface = { name, args: {} as A };
  const actionDefinition: IActionDefinition<typeof actionInterface> = {
    validator,
    perform: perform ?? noopFn,
    undo: undo ?? noopFn,
  };
  return [actionInterface, actionDefinition];
}
