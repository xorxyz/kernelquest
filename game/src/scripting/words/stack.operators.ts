import { Atom } from '../atom';
import { createMeaning } from '../meaning';

// [A] -> []
export const pop = createMeaning({
  args: {
    x: Atom,
  },
  sig: ['x'],
});

// [A B] -> [B]
export const popd = createMeaning({
  args: {
    a: Atom,
    b: Atom,
  },
  sig: ['a', 'b'],
  interpret(stack, { b }): null {
    stack.push(b);
    return null;
  },
});

// [A] -> [A A]
export const dup = createMeaning({
  args: {
    a: Atom,
  },
  sig: ['a'],
  interpret(stack, { a }): null {
    const b = a.clone();
    stack.push(a);
    stack.push(b);
    return null;
  },
});

// [A B] -> [A A B]
export const dupd = createMeaning({
  args: {
    a: Atom,
    b: Atom
  },
  sig: ['a', 'b'],
  interpret(stack, { a, b }): null {
    stack.push(a);
    stack.push(a.clone())
    stack.push(b);
    return null;
  },
});

// [A B] -> [B A]
export const swap = createMeaning({
  args: {
    a: Atom,
    b: Atom,
  },
  sig: ['a', 'b'],
  interpret(stack, { a, b }): null {
    stack.push(b);
    stack.push(a);
    return null;
  },
});

// [A B C] -> [B A C]
export const swapd = createMeaning({
  args: {
    a: Atom,
    b: Atom,
    c: Atom
  },
  sig: ['a', 'b', 'c'],
  interpret(stack, { a, b, c }): null {
    stack.push(b);
    stack.push(a);
    stack.push(c);
    return null;
  },
});
