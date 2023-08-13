import { Atom } from '../atom';
import { Literal } from '../literal';

export class LiteralQuotation extends Literal {
  private atoms: Atom[] = [];

  static from(atoms: Atom[]): LiteralQuotation {
    const quotation = new LiteralQuotation('');

    atoms.forEach((atom): void => { quotation.push(atom); });

    return quotation;
  }

  push(atom: Atom): void {
    this.atoms.push(atom);
  }
}
