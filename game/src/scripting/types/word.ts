import { RuntimeError } from '../../shared/errors';
import { IAction } from '../../shared/interfaces';
import { Queue } from '../../shared/queue';
import { Atom } from '../atom';
import { Dictionary } from '../dictionary';
import { Stack } from '../stack';

export class Word extends Atom {
  constructor (lexeme: string) {
    super('Word', lexeme);
  }

  override execute(stack: Stack, dictionary: Dictionary, queue: Queue<Atom>): IAction | null {
    const meaning = dictionary.get(this.lexeme);

    if (meaning) {
      return meaning(stack, queue);
    }

    throw new RuntimeError(`Word '${this.lexeme}' was not found in the active dictionary.`);
  }

  override serialize(): string {
    return this.lexeme;
  }

  override clone(): Word {
    return new Word(this.lexeme);
  }
}
