import { IAction, SerializableType } from '../shared/interfaces';

export class Atom {
  readonly lexeme: string;

  constructor(lexeme: string) {
    this.lexeme = lexeme;
  }

  toString(): string {
    return this.lexeme;
  }

  // eslint-disable-next-line class-methods-use-this
  execute(_: Stack): IAction | null {
    throw new Error('execute() method is not implemented');
  }

  // eslint-disable-next-line class-methods-use-this
  serialize(): SerializableType {
    throw new Error('serialize() method is not implemented');
  }
}
