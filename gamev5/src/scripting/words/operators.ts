import { Word } from '../dictionary';
import { Stack } from '../stack';

export const pop: Word = (stack: Stack): null => {
  stack.pop();
  return null;
};
