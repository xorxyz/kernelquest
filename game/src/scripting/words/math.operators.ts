import { createMeaning } from "../meaning";
import { NumberType } from "../types/number";

export const add = createMeaning({
  words: ['+'],
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

export const subtract = createMeaning({
  words: ['-', 'sub'],
  args: {
    a: NumberType,
    b: NumberType,
  },
  sig: ['a', 'b'],
  interpret(stack, { a, b }): null {
    const result = new NumberType(a.value - b.value);
    stack.push(result);
    return null;
  },
});

export const multiply = createMeaning({
  words: ['*', 'mul'],
  args: {
    a: NumberType,
    b: NumberType,
  },
  sig: ['a', 'b'],
  interpret(stack, { a, b }): null {
    const result = new NumberType(a.value * b.value);
    stack.push(result);
    return null;
  },
});

export const divide = createMeaning({
  words: ['/', 'div'],
  args: {
    a: NumberType,
    b: NumberType,
  },
  sig: ['a', 'b'],
  interpret(stack, { a, b }): null {
    const result = new NumberType(a.value / b.value);
    stack.push(result);
    return null;
  },
});
