import * as v from '@badrap/valita';
import { createActionDefinition, succeed } from '../action';

export const [CreateAction, create] = createActionDefinition({
  name: 'create',
  args: v.object({ x: v.number(), y: v.number(), kind: v.string() }),
  state: v.object({ id: v.number() }),
  perform(ctx, args) {
    return succeed({
      id: 1,
    });
  },
  undo(ctx, args, state) {
    //
    return succeed();
  },
});
