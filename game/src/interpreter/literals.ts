import { Factor, Literal, Term } from './types';

// () -> Truth
export class LiteralTruth extends Literal {
  type = 'truth';
  declare value: boolean;
  constructor(value: boolean) {
    super(String(value), value);
  }
}

const t = new LiteralTruth(true);
const f = new LiteralTruth(false);

// () -> Number
export class LiteralNumber extends Literal {
  type = 'number';
  declare value: number;
  constructor(n: number) {
    super(String(n), n);
  }
  toString() {
    return `${String(this.value)}`;
  }
}

// () -> String
export class LiteralString extends Literal {
  type = 'string';
  declare value: string;
  constructor(str: string) {
    super(`${str}`, str);
  }
  toString() {
    return `"${String(this.value)}"`;
  }
}

// () -> Set
export class LiteralSet extends Literal {
  type = 'set';
  value: Set<Literal> = new Set();
  constructor(set: Set<Literal>) {
    super('{}', set);
  }
}

// () -> Ref
export class LiteralRef extends Literal {
  type = 'ref';
  declare value: number;
  constructor(n: number) {
    super(`&${n.toString(16)}`, n);
  }

  toString() {
    return this.lexeme;
  }
}

// () -> Quotation
export class Quotation extends Literal {
  type = 'quotation';
  declare value: Term;
  constructor(term?: Term) {
    super('[]', term || []);
    this.lexeme = this.toString();
  }

  add(factor: Factor) {
    this.value.push(factor);
  }

  toString() {
    return `[${this.dequote()}]`;
  }

  dequote() {
    return this.value.map((factor) => factor.toString()).join(' ');
  }
}

export class LiteralTerm extends Literal {
  type = 'term';
  value: string;
  constructor(term: string) {
    super(term);
    this.value = term;
  }

  toString() {
    return `${this.value}`;
  }
}

const literals = {};

[t, f].forEach((literal) => {
  literals[literal.lexeme] = literal;
});

export default literals;
