import * as v from '@badrap/valita';
import { Agent } from './agent';
import { Area } from '../shared/area';
import {
  ActionArguments, ActionResultType, GameEventState, IAction, IActionResult, SerializableType,
} from '../shared/interfaces';
import { Runtime } from '../scripting/runtime';
import { Stack } from '../scripting/stack';
import { Atom } from '../scripting/atom';
import { InterpretMeaningFn } from '../scripting/meaning';
import { EntityManager } from '../state/entity_manager';
import { IGameState } from '../state/valid_state';

export interface IActionContext {
  agent: Agent,
  area: Area,
  shell: Runtime,
  entities: EntityManager,
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

  action: { name: A['name']; args: A['args'] }

  interpret: InterpretMeaningFn<A['args']>

  perform(ctx: IActionContext, args: A['args']): IActionResult

  undo(ctx: IActionContext, args: A['args'], previousState: GameEventState): IActionResult

  validate(a: IAction): a is A
}

type ActionDefinitionReturnType<
  T extends string, A extends ActionArguments
> = IActionDefinition<{ name: T; args: A; }>;

export type CreateActionDefinitionParams<
  T extends string, A extends ActionArguments
> = {
  name: T,
  args?: v.Type<A>,
  sig?: (keyof A)[],
  state?: v.Type<GameEventState>,
  perform?: (ctx: IActionContext, args: A) => IActionResult,
  undo?: (ctx: IActionContext, args: A, state: GameEventState) => IActionResult,
} | {
  name: T,
  args: v.Type<A>,
  sig: (keyof A)[],
  state?: v.Type<GameEventState>,
  perform?: (ctx: IActionContext, args: A) => IActionResult,
  undo?: (ctx: IActionContext, args: A, state: GameEventState) => IActionResult,
}

export function createActionDefinition<
T extends string, A extends ActionArguments
>({
  name, args, sig, state, perform, undo,
}: CreateActionDefinitionParams<T, A>): ActionDefinitionReturnType<T, A> {
  const definedArgs = args ?? v.object({ _no_args: v.string().optional() })
  const validator = v.object({
    name: v.literal(name),
    args: definedArgs,
    // state: state ?? v.object({ _no_state: v.string().optional() }),
  });

  const actionInterface = { name, args: {} as A };
  type ActionType = typeof actionInterface
  const actionDefinition: IActionDefinition<ActionType> = {
    validator,
    action: actionInterface,
    perform: perform ?? noopFn,
    undo: undo ?? noopFn,
    validate(action: IAction): action is ActionType {
      try {
        validator.parse(action);
        return true;
      } catch (err) {
        console.error('Action validation error:', (err as Error).message)
        // throw new Error('The values on the stack don\'t match the function signature.');
        return false;
      }
    },
    interpret(stack: Stack): ActionType {
      if (!args || !sig) {
        // This action does not take any arguments
        return { name, args: actionInterface.args };
      }

      if (stack.size < sig.length) {
        throw new Error(`I expected to find ${sig.length} argument${sig.length === 1 ? '' : 's'} on the stack, but I found ${stack.size}.`);
      }

      const popped = stack.popN(sig.length).reverse();
      const myArgs = popped
        .map((atom, index): [keyof A | undefined, Atom] => [sig[index], atom])
        .filter((kv): kv is [keyof A, Atom] => !!kv[0])
        .reduce((record, [key, atom]) => {
          record.set(key, atom.toJS());
          return record;
        }, new Map<keyof A, SerializableType>());

      const action = {
        name,
        args: Object.fromEntries(myArgs),
      };

      if (!this.validate(action)) {
        // The action failed validation, revert the stack back to its original state
        popped.forEach((atom) => { stack.push(atom); });
        throw new Error(
          `I tried to say '${name}', but I need these arguments first: [${Object.values(definedArgs.shape).map(x => x.name)}]`
          // `The values on the stack don't match the function signature: [${Object.values(definedArgs.shape).map(x => x.name)}].`
          );
      }

      return action;
    },
  };
  return actionDefinition;
}
