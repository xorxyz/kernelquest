import {
  IActionDefinition, IActionResult,
} from '../shared/action';

const succeed = (message?: string): IActionResult => ({ status: 'success', message });
const fail = (message: string):IActionResult => ({ status: 'failure', message });

const noopAction: IActionDefinition = {
  cost: 0,
  perform: (): IActionResult => succeed(),
  undo: (): IActionResult => succeed(),
};

const createAction: IActionDefinition<{ type: string }> = {
  cost: 0,
  perform(ctx, arg): IActionResult {
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

export const validActionNames: string[] = Object.values(actions)
  .flatMap((section): string[] => Object.keys(section));
