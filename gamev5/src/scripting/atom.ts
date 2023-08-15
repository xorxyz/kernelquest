import { IAction } from '../shared/interfaces';
import { Dictionary } from './dictionary';
import { Stack } from './stack';

export abstract class Atom {
  readonly lexeme: string;

  constructor(lexeme: string) {
    this.lexeme = lexeme;
  }

  toString(): string {
    return this.lexeme;
  }

  abstract execute (stack: Stack, dictionary: Dictionary): IAction | null
}
