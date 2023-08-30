import { v } from '../../shared/validation';
import { createActionDefinition, fail, succeed } from '../action';

export const sh = createActionDefinition({
  name: 'sh',
  args: v.object({
    text: v.string(),
  }),
  perform({ state }, args) {
    try {
      // tty.write(args.text);
      // state.terminalText.push(shell.printStack());
      // if (action) {
      //   state.terminalText.push(action.name);
      //   shell.queue(action);
      // }
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
