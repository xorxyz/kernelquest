import * as v from '@badrap/valita';
import { createActionDefinition, succeed } from '../action';

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
