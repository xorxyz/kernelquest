import { Factor, Literal, Term } from "../compiler";

export const True = new Literal('true', true);
export const False = new Literal('false', false);

const literals = {
  true: True,
  false: False
}

export default literals;

export class LiteralNumber extends Literal {
  constructor (lexeme, n: number) {
    super(lexeme, n);
  }
}

export class LiteralString extends Literal {
  constructor (lexeme, str: string) {
    super(lexeme, str);
  }
}

export class LiteralSet extends Literal {
  constructor (lexeme, set: Set<Literal>) {
    super(lexeme, set);
  }
}

export class Quotation extends Literal {
  constructor (lexeme, arr: Array<Factor|Term>) {
    super(lexeme, arr);
  }
}
