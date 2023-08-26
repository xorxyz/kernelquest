import {
  IActionDefinition, createActionDefinition,
} from '../action';
import * as admin from './admin';

export const [NoopAction, noop] = createActionDefinition({
  name: 'noop',
});

export interface ActionMap {
  noop: typeof NoopAction
  fork: typeof admin.ForkAction
}

export type EveryAction = ActionMap[keyof ActionMap]
export type EveryActionName = EveryAction['name']

export const actions: {
  [K in EveryActionName]: IActionDefinition<ActionMap[K]>
} = {
  noop,
  fork: admin.fork,
};

export function isValidActionName(value: string): value is EveryActionName {
  return Object.keys(actions).includes(value);
}
