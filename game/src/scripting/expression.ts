import { Atom } from './atom';

export class Expression {
  readonly text: string;

  readonly atoms: Atom[];

  constructor(text: string, atoms: Atom[]) {
    this.text = text;
    this.atoms = atoms;
  }
}
