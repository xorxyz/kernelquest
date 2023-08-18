import { ActionArguments, IAction, SerializableType } from '../shared/interfaces';
import {
  ActionArgType, VALID_ACTION_NAMES, ValidAction, actionSchema,
} from '../state/actions/valid_actions';

type Validator = (v: unknown) => boolean

const validators: Record<ActionArgType, Validator> = {
  number: (value: unknown): value is number => typeof value === 'number',
  string: (value: unknown): value is string => typeof value === 'string',
  boolean: (value: unknown): value is boolean => typeof value === 'boolean',
};

type ArgsSchema = Record<string, typeof validators[keyof typeof validators]>

const actionValidationSchema = Object.fromEntries(
  Object.values(VALID_ACTION_NAMES).map((actionName) => [
    actionName,
    {
      argsRequired: actionName in actionSchema,
      argsSchema: Object.fromEntries(
        Object.entries(actionSchema[actionName]).map(([key, type]) => [key, validators[type]]),
      ),
    },
  ]),
);

export function isSerializableType(value: unknown): value is SerializableType {
  return typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string';
}

export function isValidActionArguments(argsSchema: ArgsSchema, args = {}): args is ActionArguments {
  const entries = Object.entries(argsSchema);
  return (!entries.length && !Object.entries(args).length)
    || entries.every(([key, validate]): boolean => validate(args[key]));
}

export function isValidAction(action: IAction): action is ValidAction {
  const validationData = actionValidationSchema[action.name];
  if (!validationData) return false;
  if (validationData.argsRequired && action.args === undefined) return false;
  if (action.args && !isValidActionArguments(validationData.argsSchema ?? {}, action.args)) {
    return false;
  }
  return true;
}
