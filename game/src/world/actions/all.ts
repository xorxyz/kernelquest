import { Idea } from '../../scripting/types/idea';
import { LiteralVector } from '../../scripting/types/vector';
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
      shell.print(message);

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

export const facing = createActionDefinition({
  name: 'facing',
  perform({ agent, shell }) {
    shell.push(new LiteralVector(agent.heading.get()))
    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const left = createActionDefinition({
  name: 'left',
  perform({ agent, shell }) {
    agent.heading.left();
    shell.push(new LiteralVector(agent.heading.get()));
    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const right = createActionDefinition({
  name: 'right',
  perform({ agent, shell }) {
    agent.heading.right();
    shell.push(new LiteralVector(agent.heading.get()));
    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const point = createActionDefinition({
  name: 'point',
  sig: ['position'],
  args: v.object({
    position: v.vector(),
  }),
  perform({ area, shell }, { position }) {
    try {
      const cell = area.cellAt(position);
      shell.push(new Idea(cell.get()));
      return succeed();
    } catch (err) {
      shell.push(new Idea(0));
      return fail((err as Error).message);
    }
  },
  undo() {
    return succeed();
  },
});

export const xy = createActionDefinition({
  name: 'xy',
  perform({ agent, area, shell }) {
    shell.push(new LiteralVector(area.find(agent.id).position));
    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const step = createActionDefinition({
  name: 'step',
  perform({ agent, area, shell }) {
    try {
      area.move(agent, agent.position.clone().add(agent.heading.get()));
      shell.push(new LiteralVector(agent.position));
      return succeed();
    } catch (err) {
      shell.push(new LiteralVector(agent.position));
      return fail(`You can't go there.`);
    }
  },
  undo() {
    return succeed();
  },
});

export const look = createActionDefinition({
  name: 'look',
  sig: ['id'],
  args: v.object({
    id: v.number(),
  }),
  perform({ shell, entities }, { id }) {
    try {
      const agent = entities.getAgent(id);
      shell.print(agent.describe());
      return succeed();
    } catch (err) {
      return fail((err as Error).message);
    }
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
      'Type `"abc" help_about` to find more about the word `abc`.',
      'help\tfacing\tstep\tleft\tright\tpop\tclear',
      'point\txy\tlook\tget\tput\tread\twrite',
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
        `\tRotates your heading left and returns your new heading.`
      ],
      right: [
        'right == [] -> []',
        `\tRotates your heading right and returns your new heading.`
      ],
      step: [
        'step == [] -> [v:Vector]',
        `\tIncrements your position by your heading, if the cell is free. Returns your position.`
      ],
      xy: [
        'xy == [] -> [v:Vector]',
        `\tReturns your current position.`
      ],
      point: [
        'point == [v:Vector] -> [i:Idea]',
        `\tReturns an idea of what's at a given position.`
      ],
      look: [
        'look == [i:Idea] -> []',
        `\tDescribes the thing represented by an idea.`
      ],
      get: [
        'get == [] -> [i:Idea]',
        `\tPicks up what is in front of you, if possible. Returns an idea of that thing.`
      ],
      put: [
        'put == [] -> []',
        `\tDrops what's in your hands, if possible.`
      ],
      read: [
        'read == [] -> [q:Quotation]',
        `\tReturns the value contained in the readable thing you might be holding.`
      ],
      write: [
        'write == [q:Quotation] -> []',
        `\tWrites a value down if you are holding a writable thing.`
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

