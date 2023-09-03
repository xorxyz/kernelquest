import { IAction } from '../shared/interfaces';
import { Atom } from './atom';
import { Stack } from './stack';

export abstract class Literal extends Atom {
  override execute(stack: Stack): IAction | null {
    stack.push(this);
    return null;
  }
}
