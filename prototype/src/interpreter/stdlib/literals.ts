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
  constructor (set: Set<Literal>) {
    super('{}', set);
  }
}

export class Quotation extends Literal {
  type = 'quotation'
  program: IProgram
  constructor (program: IProgram) {
    super('[]', program.term);
    this.program = program
    this.render();
  }
  push(factor: Factor) {
    this.program.term.push(factor);
    this.render();
  }
  render() {
    this.lexeme = '[' + this.program.term.map((t:Factor) => t.lexeme).join(', ') + ']';
    this.value = this.program.term;
  }
}
