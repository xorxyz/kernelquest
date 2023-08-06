import { Atom } from './atom';

export class Expression {
  readonly code: string[];

  private atoms: Atom[];

  constructor(code: string[], atoms: Atom[]) {
    this.code = code;
    this.atoms = atoms;
  }
}
