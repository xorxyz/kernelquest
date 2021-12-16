import { Factor, Literal, Term } from "../types";

export const True = new Literal('true', true);
export const False = new Literal('false', false);

True.type = 'truth';
False.type = 'truth';

export class LiteralNumber extends Literal {
  type = 'number'
  constructor (n: number) {
    super(String(n), n);
  }
}

export class LiteralString extends Literal {
  type = 'string'
  constructor (str: string) {
    super('"' + str + '"', str);
  }
}

export class LiteralSet extends Literal {
  type = 'set'
  constructor (set: Set<Literal>) {
    super('{}', set);
  }
}

export class Quotation extends Literal {
  type = 'quotation'
  constructor (arr: Array<Factor|Term>) {
    super('[]', arr);
  }
}
