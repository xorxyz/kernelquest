import * as v from '@badrap/valita';
import { Agent } from './agent';
import { Area } from '../shared/area';
import {
  ActionArguments, ActionResultType, GameEventState, IActionResult,
} from '../shared/interfaces';

export interface IActionContext {
  agent: Agent,
  area: Area
}

export interface IActionValidator {
  name: string,
  args: ActionArguments,
  state?: GameEventState
}

export function succeed<S extends GameEventState>(m?: string, s?: S): IActionResult<S>;

export function succeed<S extends GameEventState>(state: S): IActionResult<S>;

export function succeed<S extends GameEventState = GameEventState>(
  a?: string | S, b?: S,
): IActionResult<S> {
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

export const fail = <S extends GameEventState = GameEventState>
  (message: string): IActionResult<S> => ({
    type: ActionResultType.FAILURE,
    message,
  });

const noopFn = (): IActionResult<never> => succeed();

export interface IActionDefinition<
  A extends IActionValidator
> {
  validator: v.ObjectType

  perform(ctx: IActionContext, args: A['args']): IActionResult<A['state']>

  undo(ctx: IActionContext, args: A['args'], previousState: A['state']): IActionResult<A['state']>
}

type ActionDefinitionReturnType<
  T extends string, A extends ActionArguments, B extends GameEventState
> = [
  { name: T; args: A },
  IActionDefinition<{ name: T; args: A; state: B }>
];

export interface ICreateActionDefinitionParams<
  T extends string, A extends ActionArguments, B extends GameEventState
> {
  name: T,
  args?: v.Type<A>,
  state?: v.Type<B>,
  perform?: (ctx: IActionContext, args: A) => IActionResult<B>,
  undo?: (ctx: IActionContext, args: A, state: B) => IActionResult<B>,
}

export function createActionDefinition<
T extends string, A extends ActionArguments, B extends GameEventState
>({
  name, args, state, perform, undo,
}: ICreateActionDefinitionParams<T, A, B>): ActionDefinitionReturnType<T, A, B> {
  const validator = v.object({
    name: v.literal(name),
    args: args ?? v.object({ _no_args: v.string().optional() }),
    state: state ?? v.object({ _no_state: v.string().optional() }),
  });

  const actionInterface = { name, args: {} as A, state: {} as B };
  const actionDefinition: IActionDefinition<typeof actionInterface> = {
    validator,
    perform: perform ?? noopFn,
    undo: undo ?? noopFn,
  };
  return [actionInterface, actionDefinition];
}
