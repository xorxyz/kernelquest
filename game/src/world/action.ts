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

export interface IActionContext {
  agent: Agent,
  area: Area,
  shell: Runtime,
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
  const validator = v.object({
    name: v.literal(name),
    args: args ?? v.object({ _no_args: v.string().optional() }),
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
        throw new Error(`Expected to find ${sig.length} values on the stack, but found ${stack.size}.`);
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

      console.log('validate', this)

      if (!this.validate(action)) {
        // The action failed validation, revert the stack back to its original state
        popped.forEach((atom) => { stack.push(atom); });
        throw new Error(
          `The values on the stack don't match the function signature: [${sig.join(' ')}]. Instead, got ${JSON.stringify(Object.entries(action.args))}`
          );
      }

      return action;
    },
  };
  return actionDefinition;
}
