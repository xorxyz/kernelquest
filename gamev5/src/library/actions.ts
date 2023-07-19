import { IActionDefinition } from '../shared/action';
import { ActionResultType, IActionResult } from '../shared/interfaces';

const succeed = (message?: string): IActionResult => ({ type: ActionResultType.SUCCESS, message });

const fail = (message: string):IActionResult => ({ type: ActionResultType.FAILURE, message });

const noopAction: IActionDefinition = {
  cost: 0,
  perform: (): IActionResult => succeed(),
  undo: (): IActionResult => succeed(),
};

const createAction: IActionDefinition<{ type: string }> = {
  cost: 0,
  perform(): IActionResult {
    return fail('TODO');
  },
  undo(): IActionResult {
    return fail('TODO');
  },
};

export const actions: Record<string, Record<string, IActionDefinition>> = {
  admin: {
    noop: noopAction,
    create: createAction,
  },
};

export const validActions: string[] = Object.values(actions)
  .flatMap((section): string[] => Object.keys(section));
