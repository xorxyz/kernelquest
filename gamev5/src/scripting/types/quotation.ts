import { Atom } from '../atom';
import { Literal } from '../literal';

export class Quotation extends Literal {
  private atoms: Atom[] = [];

  static from(atoms: Atom[]): Quotation {
    const quotation = new Quotation('');

    atoms.forEach((atom): void => { quotation.push(atom); });

    return quotation;
  }

  push(atom: Atom): void {
    this.atoms.push(atom);
  }
}
