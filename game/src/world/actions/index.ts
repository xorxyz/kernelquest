import { Dictionary } from '../../scripting/dictionary';
import { InterpretMeaningFn, WordArguments } from '../../scripting/meaning';
import { ActionArguments, IAction } from '../../shared/interfaces';
import { fork } from '../../vm/syscalls';
import {
  IActionDefinition, createActionDefinition,
} from '../action';
import { sh, clear } from './admin';

export const noop = createActionDefinition({
  name: 'noop',
});

export interface ActionMap {
  noop: typeof noop.action
  sh: typeof sh.action
  clear: typeof clear.action
  fork: typeof fork.action
}

export type EveryAction = ActionMap[keyof ActionMap]
export type EveryActionName = EveryAction['name']

export const actions: {
  [K in EveryActionName]: IActionDefinition<ActionMap[K]>
} = {
  noop,
  sh,
  clear,
  fork,
};

export const actionWords = Dictionary.from(
  Object.fromEntries(Object.entries(actions).reduce((record, [name, action]) => {
    record.set(name, action.interpret);
    return record;
  }, new Map<string, InterpretMeaningFn<ActionArguments|WordArguments>>())),
);

export function isValidActionName(value: string): value is EveryActionName {
  return Object.keys(actions).includes(value);
}

export function isValidAction(action: IAction): action is EveryAction {
  const definitions = actions as Record<string, IActionDefinition<unknown>>;
  const definition = definitions[action.name];
  if (!definition) return false;
  return definition.validate(action);
}
