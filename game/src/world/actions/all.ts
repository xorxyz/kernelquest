import * as v from '../../shared/validation';
import { createActionDefinition, fail, succeed } from '../action';

export const sh = createActionDefinition({
  name: 'sh',
  args: v.object({
    text: v.string(),
  }),
  sig: ['text'],
  perform({ state, shell }, args) {
    try {
      shell.execute(args.text);
      return succeed('# ' + args.text);
    } catch (err) {
      const { message } = err as Error;
      state.terminal.output.push(message);

      return fail(message);
    }
  },
  undo() {
    return succeed();
  },
});

export const next = createActionDefinition({
  name: 'next',
  perform({ shell }) {
    shell.continue();
    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const debug = createActionDefinition({
  name: 'debug',
  perform({ state }) {
    state.debugMode = !state.debugMode;

    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const clear = createActionDefinition({
  name: 'clear',
  perform({ state, shell }) {
    shell.clear();

    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const create = createActionDefinition({
  name: 'create',
  sig: ['type', 'position'],
  args: v.object({
    type: v.string(),
    position: v.tuple([v.number(), v.number()]),
  }),
  perform() {
    return fail('TODO');
  },
  undo() {
    return succeed();
  },
});

export const help = createActionDefinition({
  name: 'help',
  perform({ shell }) {
    [
      'kernelquest, v5.0.0',
      'Type `name help_about` to find more about the function `name`.',
      'help\tpop\tfacing\tstep\tleft\tright',
      'xy\tclear\tlook\tlook\tget\tput',
    ].forEach(line => shell.print(line));

    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const help_about = createActionDefinition({
  name: 'help_about',
  sig: ['word'],
  args: v.object({
    word: v.string(),
  }),
  perform({ shell }, { word }) {
    console.log('name', word);
    const lines = {
      pop: [
        'pop == [x:Atom] -> []',
        `\tRemoves the atom that's on top of the stack.`
      ],
      clear: [
        'clear == [] -> []',
        `\tClears the terminal output.`
      ],
      facing: [
        'facing == [] -> [v:Vector]',
        `\tReturns your current heading.`
      ],
      left: [
        'left == [] -> []',
        `\tRotates your heading left.`
      ],
      right: [
        'left == [] -> []',
        `\tRotates your heading right.`
      ],
      step: [
        'step == [] -> []',
        `\t Increments your position by your heading, if the cell you are facing is free.`
      ],
    }[word];

    if (!lines) return fail(`There is no help text for command '${word}'.`);

    lines.forEach(line => shell.print(line));

    return succeed();
  },
  undo() {
    return succeed();
  },
});

