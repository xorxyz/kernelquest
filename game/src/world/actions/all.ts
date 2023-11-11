import { Idea } from '../../scripting/types/idea';
import { StringType } from '../../scripting/types/string';
import { LiteralVector } from '../../scripting/types/vector';
import { logger } from '../../shared/logger';
import * as v from '../../shared/validation';
import { createActionDefinition, fail, succeed } from '../action';
import { Flag, Scroll } from '../agent';
import { Area } from '../area';

export const sh = createActionDefinition({
  name: 'sh',
  args: v.object({
    text: v.string(),
  }),
  sig: ['text'],
  perform({ shell }, args) {
    try {
      shell.execute(args.text);
      return succeed();
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
  perform({ shell }) {
    logger.warn('Tried to toggle debug mode');
    // if (shell.isDebugEnabled()) {
    //   shell.disableDebug();
    // } else {
    //   shell.enableDebug();
    // }

    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const clear = createActionDefinition({
  name: 'clear',
  perform({ shell }) {
    shell.clear();

    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const nothing = createActionDefinition({
  name: 'nothing',
  perform({ shell }) {
    shell.push(new Idea(0));

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

export const heading = createActionDefinition({
  name: 'heading',
  perform({ agent, shell }) {
    shell.push(new LiteralVector(agent.heading.get()))
    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const facing = createActionDefinition({
  name: 'facing',
  perform({ agent, shell }) {
    shell.push(new LiteralVector(agent.facing()))
    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const left = createActionDefinition({
  name: 'left',
  perform({ agent, area, shell }) {
    agent.heading.left();
    area.updateHandle(agent);
    shell.push(new LiteralVector(agent.heading.get()));
    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const right = createActionDefinition({
  name: 'right',
  perform({ agent, area, shell }) {
    agent.heading.right();
    area.updateHandle(agent);
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
  perform({ agent, area, shell, entities, state }) {
    try {
      const destination = agent.position.clone().add(agent.heading.get());

      // Agent is trying to leave the bounds of the area
      if (!Area.bounds.contains(destination)) {
        try {
          const holdingId = agent.holding();  
          const holding = entities.getAgent(holdingId);
          if (holding instanceof Flag) {
            state.level.victory = true;
            return succeed();
          }
        } catch (err) {
          // 
        }
      }

      area.move(agent, destination);
      shell.push(new LiteralVector(agent.position));

      return succeed();
    } catch (err) {
      shell.push(new LiteralVector(agent.position));
      return fail((err as Error).message);
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
  perform({ area, entities }, { id }) {
    try {
      if (id === 0) throw new Error(`It's nothing.`);
      if (id === 1) return succeed(`That's you, a wizard.`);
      area.find(id);
      const agent = entities.getAgent(id);
      return succeed(agent.describe());
    } catch (err) {
      return fail((err as Error).message);
    }
  },
  undo() {
    return succeed();
  },
});

export const hands = createActionDefinition({
  name: 'hands',
  perform({ agent, shell }) {
    try {
      const id = agent.holding();
      if (!id) throw new Error('There is nothing in your hands.');
      shell.push(new Idea(id));
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

export const get = createActionDefinition({
  name: 'get',
  perform({ agent, area, entities, shell, state }) {
    try {
      const target = area.cellAt(agent.position.clone().add(agent.heading.get()));
      const x = target.get();
      if (!x) throw new Error('There is nothing here.');
      const entity = entities.getAgent(x.id);
      if (!['flag', 'scroll', 'sheep'].includes(entity.type)) {
        throw new Error(`You can't get this.`);
      };
      agent.get(entity);
      target.remove(x.id);
      shell.push(new Idea(x.id));

      // if (entity instanceof Flag) {
      //   state.level.victory = true;
      //   return succeed('You got the flag!');
      // }

      return succeed(`You get the ${entity.type}.`);
    } catch (err) {
      shell.push(new Idea(0));
      return fail((err as Error).message);
    }
  },
  undo() {
    return succeed();
  },
});

export const put = createActionDefinition({
  name: 'put',
  perform({ agent, area, entities, shell }) {
    try {
      const entity = agent.put();
      if (!entity) throw new Error('You are not holding anything.');
      area.put(agent.facing(), entity);
      return succeed(`You put the ${entity.type} down.`);
    } catch (err) {
      return fail((err as Error).message);
    }
  },
  undo() {
    return succeed();
  },
});

export const type = createActionDefinition({
  name: 'type',
  perform({ shell }) {
    const atom = shell.pop();
    if (!atom) {
      shell.push(new StringType('None'))
      return fail('`type` expecteds an atom on the stack.')
    }
    shell.push(new StringType(atom.type));
    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const read = createActionDefinition({
  name: 'read',
  perform({ agent, entities, shell }) {
    try {
      const id = agent.holding();
      const entity = entities.getAgent(id);
      if (entity.type !== 'scroll') throw new Error(`That is not something you can read.`);
      const text = (entity as Scroll).read();
      shell.push(new StringType(text));
      shell.print(`It reads: '${text}'.`);
      return succeed();
    } catch (err) {
      return fail((err as Error).message);
    }
  },
  undo() {
    return succeed();
  },
});

export const write = createActionDefinition({
  name: 'write',
  sig: ['text'],
  args: v.object({
    text: v.string()
  }),
  perform({ agent, entities, shell }, { text }) {
    try {
      const id = agent.holding();
      const entity = entities.getAgent(id);
      if (entity.type !== 'scroll') throw new Error(`That is not something you can write.`);
      (entity as Scroll).write(text);
      shell.print(`You write: '${text}' on the ${entity.type}.`);
      return succeed();
    } catch (err) {
      return fail((err as Error).message);
    }
  },
  undo() {
    return succeed();
  },
});

export const play_music = createActionDefinition({
  name: 'play_music',
  sig: ['title'],
  args: v.object({
    title: v.string()
  }),
  perform() {
    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const pause_music = createActionDefinition({
  name: 'pause_music',
  perform() {
    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const load_level = createActionDefinition({
  name: 'load_level',
  sig: ['id'],
  args: v.object({
    id: v.number()
  }),
  perform({ load, state, shell }, { id }) {
    shell.clear();

    load(id);

    state.level.id = id;
    state.level.victory = false;
    state.history = [];

    return succeed();
  },
  undo() {
    return succeed();
  },
})

export const help = createActionDefinition({
  name: 'help',
  perform({ shell }) {
    [
      // `When you say a word, it gets added to a stack. Many words just stay there.`,
      // `Some change the preceding ones. A few make you do something, then they vanish.`,
      // ``,
      // `To learn more about a word, say it in double quotes and then 'about'.`,
      // `For example, you can learn more about 'xy' by saying:`,
      // `"xy" about`,
      // ``,
      `The words you can use are:`,
      'help\tleft\tright\tstep\tget',
      // 'help\tabout\txy\theading\tfacing\tleft\tright\tstep',
      // 'point\tlook\thands\tget\tput\tread\tpop\tclear',
    ].forEach(line => shell.print(line));

    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const about = createActionDefinition({
  name: 'about',
  sig: ['word'],
  args: v.object({
    word: v.string(),
  }),
  perform({ shell }, { word }) {
    const lines = {
      help: [
        'help == [] -> []',
        `Lists the available words.`
      ],
      about: [
        'about == [word:String] -> []',
        `Describes the usage of a given word.`
      ],
      pop: [
        'pop == [x:Atom] -> []',
        `Removes the atom that's on top of the stack.`
      ],
      clear: [
        'clear == [] -> []',
        `Clears the terminal output and the stack.`
      ],
      heading: [
        'heading == [] -> [v:Vector]',
        `Returns your current heading.`
      ],
      facing: [
        'facing == [] -> [v:Vector]',
        `Returns the position in front of you.`
      ],
      left: [
        'left == [] -> []',
        `Rotates your heading left and returns your new heading.`
      ],
      right: [
        'right == [] -> []',
        `Rotates your heading right and returns your new heading.`
      ],
      step: [
        'step == [] -> [v:Vector]',
        `Increments your position by your heading, if the cell is free. Returns your position.`
      ],
      xy: [
        'xy == [] -> [v:Vector]',
        `Returns your current position.`
      ],
      point: [
        'point == [v:Vector] -> [i:Idea]',
        `Returns an idea of what's at a given position.`
      ],
      look: [
        'look == [i:Idea] -> []',
        `Describes the thing represented by an idea.`
      ],
      hands: [
        'hands == [] -> [i:Idea]',
        'Returns an idea of what is your hands.'
      ],
      get: [
        'get == [] -> [i:Idea]',
        `Picks up what is in front of you, if possible. Returns an idea of that thing.`
      ],
      put: [
        'put == [] -> []',
        `Drops what's in your hands, if possible.`
      ],
      read: [
        'read == [] -> [q:Quotation]',
        `Returns the value contained in the readable thing you might be holding.`
      ],
      write: [
        'write == [q:Quotation] -> []',
        `Writes a value down if you are holding a writable thing.`
      ],
      nothing: [
        'nothing == [] -> [&0]',
        `Returns an empty idea.`
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
