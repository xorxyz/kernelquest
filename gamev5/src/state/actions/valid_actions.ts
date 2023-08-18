import {
  ActionArguments, IGameEvent,
} from '../../shared/interfaces';

export type ActionArgType = 'number' | 'string' | 'boolean';

export const VALID_ACTION_NAMES = ['noop', 'load', 'save'] as const;

export type ActionName = typeof VALID_ACTION_NAMES[number];

export const actionSchema: Record<ActionName, Record<string, ActionArgType>> = {
  noop: {},
  load: { id: 'number' },
  save: {},
};

export interface BaseAction {
  name: string,
  args?: ActionArguments
}

export type ValidAction = BaseAction &
  (typeof actionSchema[ActionName] extends infer ArgsSchema
    ? { name: ActionName } & (ArgsSchema extends {} ? { args?: ArgsSchema } : {})
    : never);

export interface IValidGameEvent extends IGameEvent {
  action: ValidAction,
}
