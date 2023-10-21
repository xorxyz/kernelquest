import { Dictionary } from '../../scripting/dictionary';
import { InterpretMeaningFn, WordArguments } from '../../scripting/meaning';
import { ActionArguments, IAction } from '../../shared/interfaces';
import { fork } from '../../vm/syscalls';
import {
  IActionDefinition, createActionDefinition,
} from '../action';
import { 
  sh, clear, next, debug, help, about, heading, facing, 
  left, right, xy, step, point, look, hands, get, put, 
  type, read, write, play_music, pause_music, load_level,
  nothing
} from './all';

export const noop = createActionDefinition({
  name: 'noop',
});

export interface ActionMap {
  noop: typeof noop.action
  sh: typeof sh.action
  clear: typeof clear.action
  fork: typeof fork.action
  next: typeof next.action
  debug: typeof debug.action
  help: typeof help.action
  about: typeof about.action
  heading: typeof heading.action
  facing: typeof facing.action
  left: typeof left.action
  right: typeof right.action
  xy: typeof xy.action
  step: typeof step.action
  point: typeof point.action
  look: typeof look.action
  hands: typeof hands.action
  get: typeof get.action
  put: typeof put.action
  type: typeof type.action
  read: typeof read.action
  write: typeof write.action
  play_music: typeof play_music.action
  pause_music: typeof pause_music.action
  load_level: typeof load_level.action
  nothing: typeof nothing.action
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
  next,
  debug,
  help,
  about,
  heading,
  facing,
  left,
  right,
  xy,
  step,
  point,
  look,
  hands,
  get,
  put,
  type,
  read,
  write,
  play_music,
  pause_music,
  load_level,
  nothing
};

export const actionWords = Dictionary.from(
  Object.fromEntries(Object.entries(actions).reduce((record, [name, action]) => {
    record.set(name, action.interpret.bind(action));
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
