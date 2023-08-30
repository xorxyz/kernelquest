import { fork } from '../../os/syscalls';
import {
  IActionDefinition, createActionDefinition,
} from '../action';
import { sh } from './admin';

export const noop = createActionDefinition({
  name: 'noop',
});

export interface ActionMap {
  noop: typeof noop.action
  sh: typeof sh.action
  fork: typeof fork.action
}

export type EveryAction = ActionMap[keyof ActionMap]
export type EveryActionName = EveryAction['name']

export const actions: {
  [K in EveryActionName]: IActionDefinition<ActionMap[K]>
} = {
  noop,
  sh,
  fork,
};

export function isValidActionName(value: string): value is EveryActionName {
  return Object.keys(actions).includes(value);
}
