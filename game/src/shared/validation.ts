import * as v from '@badrap/valita'
import { Vector } from './vector';

export type * from '@badrap/valita';

export * from '@badrap/valita';

export const vector = () => v.unknown().chain((t) => {
  if (!(t instanceof Vector)) return v.err();

  return v.ok(t);
});
