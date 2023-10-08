import * as v from '@badrap/valita'
import { Vector } from './vector';
import { Atom } from '../scripting/atom';

export type * from '@badrap/valita';

export * from '@badrap/valita';

export const vector = () => v.unknown().chain((t) => {
  if (!(t instanceof Vector)) return v.err();

  return v.ok(t);
});

export const any = () => v.unknown().chain((t) => {
  console.log('any', typeof t, t)
  if (
    !(typeof t === 'string') &&
    !(typeof t === 'boolean') &&
    !(typeof t === 'number') &&
    !(t instanceof Vector) &&
    !(t instanceof Atom)
  ) return v.err('Expected an atom but got something else.');

  return v.ok(t);
});
