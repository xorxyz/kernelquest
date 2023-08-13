export abstract class Atom {
  readonly lexeme: string;

  constructor(lexeme: string) {
    this.lexeme = lexeme;
  }

  toString(): string {
    return this.lexeme;
  }
}
