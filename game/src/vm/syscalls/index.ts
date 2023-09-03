import * as v from '../../shared/validation';
import { createActionDefinition, succeed } from '../../world/action';

export const fork = createActionDefinition({
  name: 'fork',
  state: v.object({ id: v.number() }),
  perform() {
    return succeed();
  },
  undo() {
    return succeed();
  },
});

export const exec = createActionDefinition({
  name: 'exec',
  perform() {
    return succeed();
  },
  undo() {
    return succeed();
  },
});
