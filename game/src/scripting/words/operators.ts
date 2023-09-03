import { Atom } from '../atom';
import { createMeaning } from '../meaning';
import { NumberType } from '../types/number';

export const pop = createMeaning({
  args: {
    x: Atom,
  },
  sig: ['x'],
});

export const plus = createMeaning({
  words: ['+', 'add'],
  args: {
    a: NumberType,
    b: NumberType,
  },
  sig: ['a', 'b'],
  interpret(stack, { a, b }): null {
    const result = new NumberType(a.value + b.value);
    stack.push(result);
    return null;
  },
});
