import * as v from '@badrap/valita';
import {
  IActionDefinition, createActionDefinition,
} from '../action';
import { create, CreateAction } from './admin';

export const [NoopAction, noop] = createActionDefinition({
  name: 'noop',
  args: v.object({ _noop: v.string().optional() }),
});

export interface ActionMap {
  noop: typeof NoopAction
  create: typeof CreateAction
}

export type EveryAction = ActionMap[keyof ActionMap]

export type EveryActionName = EveryAction['name']

export const actions: {
  [K in EveryActionName]: IActionDefinition<ActionMap[K]>
} = {
  noop,
  create,
};
