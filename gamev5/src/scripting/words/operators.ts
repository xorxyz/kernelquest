import { Meaning } from '../dictionary';
import { Stack } from '../stack';

export const pop: Meaning = (stack: Stack): null => {
  stack.pop();
  return null;
};
