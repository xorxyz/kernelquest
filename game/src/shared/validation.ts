import * as v from '@badrap/valita'
import { Vector } from './vector';

export type * from '@badrap/valita';

export * from '@badrap/valita';

export const vector = () => v.tuple([v.number(), v.number()]).chain((t) => {
  const p = new Vector(t[0], t[1]);

  return v.ok(p);
});
