import * as v from '@badrap/valita';
import { createActionDefinition, succeed } from '../action';

export const [CreateAction, create] = createActionDefinition({
  name: 'create',
  args: v.object({
    x: v.number(),
    y: v.number(),
    kind: v.string(),
  }),
  perform: () => succeed(),
  undo: () => succeed(),
});
