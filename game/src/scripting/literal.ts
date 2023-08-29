import { Atom } from './atom';
import { Stack } from './stack';

export abstract class Literal extends Atom {
  execute(stack: Stack): IAction {
    stack.push(this);
  }
}
