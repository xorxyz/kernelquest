import { RuntimeError } from '../../shared/errors';
import { IAction } from '../../shared/interfaces';
import { Atom } from '../atom';
import { Dictionary } from '../dictionary';
import { Stack } from '../stack';

export class Identifier extends Atom {
  override execute(stack: Stack, dictionary: Dictionary): IAction | null {
    const word = dictionary.get(this.lexeme);

    if (word) {
      return word(stack);
    }

    throw new RuntimeError(`Identifier '${this.lexeme}' was not found in the active dictionary.`);
  }
}
