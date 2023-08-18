import { RuntimeError } from '../../shared/errors';
import { IAction } from '../../shared/interfaces';
import { Atom } from '../atom';
import { Dictionary } from '../dictionary';
import { Stack } from '../stack';

export class Word extends Atom {
  override execute(stack: Stack, dictionary: Dictionary): IAction | null {
    const meaning = dictionary.get(this.lexeme);

    if (meaning) {
      return meaning(stack);
    }

    throw new RuntimeError(`Word '${this.lexeme}' was not found in the active dictionary.`);
  }
}
