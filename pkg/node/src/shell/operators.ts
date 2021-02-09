import { BooleanLiteral, DataStack } from './types';

export const t = (stack: DataStack) => {
  stack.push(new BooleanLiteral(true));
  return stack;
};

export const f = (stack: DataStack) => {
  stack.push(new BooleanLiteral(false));
  return stack;
};

export default {
  t, f,
};
