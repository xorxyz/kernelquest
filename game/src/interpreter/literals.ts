import { Vector } from '../shared';
import { Factor, Literal, Term } from './types';

// () -> Truth
export class LiteralTruth extends Literal {
  type = 'truth';
  declare value: boolean;
  constructor(value: boolean) {
    super(String(value), value);
  }

  dup() {
    return new LiteralTruth(this.value);
  }
}

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

  dup() {
    return new LiteralNumber(this.value);
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

  dup() {
    return new LiteralString(this.value);
  }
}

// () -> Set
export class LiteralSet extends Literal {
  type = 'set';
  value: Set<Literal> = new Set();
  constructor(set: Set<Literal>) {
    super('{}', set);
  }

  dup() {
    return new LiteralSet(new Set(...this.value.entries()));
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

  dup() {
    return new LiteralRef(this.value);
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

  static from(term: Term): Quotation | LiteralList | LiteralVector {
    // Parse the quotation as a LiteralVector if it's a list of 2 numbers
    if (LiteralVector.isVector(term)) {
      const [x, y] = term.map((item) => item.value) as [number, number];
      return new LiteralVector(new Vector(x, y));
    }

    // Parse the quotation as a LiteralList if all its items are of the same type
    if (LiteralList.isList(term)) {
      return new LiteralList(term as List);
    }

    return new Quotation(term);
  }

  add(factor: Factor) {
    this.value.push(factor);
  }

  unshift(factor: Factor) {
    this.value.unshift(factor);
  }

  toString() {
    return `[${this.dequote()}]`;
  }

  dequote() {
    return this.value.map((factor) => factor.toString()).join(' ');
  }

  dup() {
    return new Quotation([...this.value.map((f) => f.dup())]);
  }
}

export type List = (
  Array<LiteralTruth> |
  Array<LiteralNumber> |
  Array<LiteralString> |
  Array<LiteralRef>
)

const literalTypes = ['truth', 'number', 'string', 'ref'];

export class LiteralList extends Quotation {
  type = 'list';
  declare value: List;
  constructor(term: List) {
    super(term);
    this.lexeme = this.toString();
  }

  static isList(term: Term) {
    const types = term.map((item) => item.type);
    return (
      types.every((t) => literalTypes.includes(t))
      && new Set(term.map((item) => item.type)).size === 1
    );
  }

  dup() {
    return new LiteralList([...this.value.map((f) => f.dup())]);
  }
}

export class LiteralVector extends Quotation {
  type = 'vector';
  declare value: [LiteralNumber, LiteralNumber];
  vector: Vector;
  constructor(v: Vector) {
    super([new LiteralNumber(v.x), new LiteralNumber(v.y)]);
    this.lexeme = this.toString();
    this.vector = v.clone();
  }

  static isVector(term: Term) {
    return term.length === 2 && term.every((item) => typeof item.value === 'number');
  }

  dup() {
    return new LiteralVector(this.vector.clone());
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

  dup() {
    return new LiteralTerm(this.value);
  }
}
