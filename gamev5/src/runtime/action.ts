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
  args: ActionArguments
}

export const succeed = <S extends GameEventState = GameEventState>
  (message?: string, state?: S): IActionResult<S> => ({
    type: ActionResultType.SUCCESS,
    message,
    state,
  });

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

  perform(ctx: IActionContext, args: A['args']): IActionResult<any>

  undo(ctx: IActionContext, previousState?: any, args: A['args']): IActionResult<any>
}

type ActionDefinitionReturnType<T extends string, A extends ActionArguments> = [
  { name: T; args: A },
  IActionDefinition<{ name: T; args: A }>
];

export interface ICreateActionDefinitionParams<T extends string, A extends ActionArguments> {
  name: T,
  args: v.Type<A>,
  perform?: (ctx: IActionContext, args: A) => IActionResult<never>,
  undo?: (ctx: IActionContext) => IActionResult<never>,
}

export function createActionDefinition<T extends string, A extends ActionArguments>({
  name, args, perform, undo,
}: ICreateActionDefinitionParams<T, A>): ActionDefinitionReturnType<T, A> {
  const actionInterface = { name, args: {} as A };
  const actionDefinition: IActionDefinition<typeof actionInterface> = {
    validator: v.object({
      name: v.literal(name),
      args,
    }),
    perform: perform ?? noopFn,
    undo: undo ?? noopFn,
  };
  return [actionInterface, actionDefinition];
}
