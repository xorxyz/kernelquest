import { Atom } from '../atom';
import { Literal } from '../literal';

export class Quotation extends Literal {
  readonly atoms: Atom[] = [];

  constructor() {
    super('[]');
  }

  static from(atoms: Atom[]): Quotation {
    const quotation = new Quotation();

    atoms.forEach((atom): void => { quotation.push(atom); });

    return quotation;
  }

  override toString(): string {
    return `[${this.atoms.map((atom: Atom): string => atom.toString()).join(' ')}]`;
  }

  push(atom: Atom): void {
    this.atoms.push(atom);
  }

  override clone(): Quotation {
    return Quotation.from(this.atoms);
  }
}