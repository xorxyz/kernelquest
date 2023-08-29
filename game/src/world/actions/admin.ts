import * as v from '@badrap/valita';
import { createActionDefinition, fail, succeed } from '../action';

export const [ShAction, sh] = createActionDefinition({
  name: 'sh',
  args: v.object({
    text: v.string(),
  }),
  perform({ tty, shell, state }, args) {
    try {
      tty.push(args.text);
      const action = shell.run();
      state.terminalText.push(shell.printStack());
      if (action) {
        state.terminalText.push(action.name);
        shell.queue(action);
      }
      return succeed();
    } catch (err) {
      const { message } = err as Error;
      state.terminalText.push(message);

      return fail(message);
    }
  },
  undo() {
    return succeed();
  },
});

export const [ForkAction, fork] = createActionDefinition({
  name: 'fork',
  state: v.object({ id: v.number() }),
  perform() {
    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const [ExecAction, exec] = createActionDefinition({
  name: 'exec',
  perform() {
    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const [LoginAction, login] = createActionDefinition({
  name: 'login',
  perform() {
    return succeed();
  },
  undo() {
    return succeed();
  },
});
