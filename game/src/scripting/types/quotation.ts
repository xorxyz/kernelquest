import { Atom } from '../atom';
import { Literal } from '../literal';

export class Quotation extends Literal {
  override readonly value: Atom[] = [];

  constructor(lex: string = '[]') {
    super(lex);
  }

  static from(atoms: Atom[]): Quotation {
    const lexeme = '[' + atoms.map(atom => atom.toString()).join(' ') + ']';

    const quotation = new Quotation(lexeme);

    atoms.forEach((atom): void => { quotation.push(atom); });

    return quotation;
  }

  override toString(): string {
    return `[${this.value.map((atom: Atom): string => atom.toString()).join(' ')}]`;
  }

  override clone(): Quotation {
    return Quotation.from(this.value);
  }

  private push(atom: Atom): void {
    this.value.push(atom);
  }
}
