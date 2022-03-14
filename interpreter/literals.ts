import { Vector } from 'xor4-lib/math';
import { Factor, Literal, Term } from './types';

// () -> Truth
export class LiteralTruth extends Literal {
  value: Boolean = true;
  type = 'truth';
  constructor(value: Boolean) {
    super(String(value), value);
  }
}

const t = new LiteralTruth(true);
const f = new LiteralTruth(false);

console.log(t, f);

// () -> Number
export class LiteralNumber extends Literal {
  type = 'number';
  constructor(n: number) {
    super(String(n), n);
  }
}

// () -> String
export class LiteralString extends Literal {
  type = 'string';
  constructor(str: string) {
    super(`"${str}"`, str);
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

// () -> Quotation
export class Quotation extends Literal {
  type = 'quotation';
  value: Term = [];
  constructor(term?: Term) {
    super('[]', term || []);
  }

  add(factor: Factor) {
    this.value.push(factor);
  }

  toString() {
    return `[${this.value.map((item) => item.toString()).join(' ')}]`;
  }
}

// () -> Ref
export class LiteralRef extends LiteralNumber {
  type = 'ref';
  vector: Vector;
  constructor(x: number, y: number) {
    super((y * 16) + x);

    this.vector = new Vector(x, y);
  }

  toString() {
    return `[${this.vector.x} ${this.vector.y} ref]`;
  }
}

// () -> Direction
export class Direction extends Quotation {
  type = 'direction';
  vector: Vector;
  constructor(lexeme: string, x:number, y:number) {
    super([new LiteralNumber(x), new LiteralNumber(y)]);

    this.lexeme = lexeme;
  }
}

const north = new Direction('north', 0, -1);
const east = new Direction('east', 1, 0);
const south = new Direction('south', 0, 1);
const west = new Direction('west', -1, 0);

const literals = {};

[t, f, north, east, south, west].forEach((literal) => {
  literals[literal.lexeme] = literal;
});

export default literals;
