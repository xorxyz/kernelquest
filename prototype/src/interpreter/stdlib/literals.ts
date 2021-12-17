import { Compiler } from "../compiler";
import { Token, TokenType } from "../lexer";
import { Factor, IProgram, Literal } from "../types";

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
  constructor (program?: IProgram) {
    super('[]', program || { term: [], tokens: [] });
    this.render();
  }

  add (factor: Factor) {
    const dict = {
      LiteralNumber: TokenType.NUMBER,
      LiteralString: TokenType.STRING,
      Quotation: TokenType.QUOTATION
    }
    
    const ctorName = Object.getPrototypeOf(factor).constructor.name;
    const tokenType = dict[ctorName];

    if (!tokenType) {
      throw new Error(`token type not found for ctor: '${ctorName}'`)
    }

    this.push(
      new Token(tokenType, factor.lexeme, factor.value, 0)
    );
  }

  push(token: Token) {
    this.value.tokens.push(token);
    this.compile();
    this.render();
  }

  compile () {
    const compiler = new Compiler();
    console.log('about to compile', this.value);
    this.value = compiler.compile(this.value.tokens.map(t => t.lexeme).join(' '));
    console.log('compiled', this);
  }

  render() {
    this.lexeme = (
      '[' + 
      this.value.tokens.slice(0, -1)
                       .map((t:Token) => t.lexeme)
                       .join(' ') + 
      ']'
    );
  }
}

const literals = {};

[True, False].forEach((literal) => {
  literals[literal.lexeme] = literal;
})

export default literals;
