import { Token } from "../lexer";
import { Factor, IProgram, Literal, Term } from "../types";

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
  value: Set<Literal>
  constructor (set: Set<Literal>) {
    super('{}', set);
  }
}

export class Quotation extends Literal {
  type = 'quotation'
  value: IProgram
  constructor (program: IProgram) {
    super('[]', program.term);
    this.value = program
    this.render();
  }
  push(factor: Factor) {
    this.value.term.push(factor);
    this.render();
  }
  render() {
    this.lexeme = '[' + this.value.term.map((t:Factor) => t.lexeme).join(' ') + ']';
  }
}

const literals = {};

[True, False].forEach((literal) => {
  literals[literal.lexeme] = literal;
})

export default literals;
