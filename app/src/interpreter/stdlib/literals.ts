declare global  {
  interface ProxyConstructor {
      new <TSource extends object, TTarget extends object>(target: TSource, handler: ProxyHandler<TSource>): TTarget;
  }
}

import { Compiler } from "../compiler";
import { Token, TokenType } from "../lexer";
import { Factor, IProgram, Literal } from "../types";
import { Vector } from "../../../../lib/math";

export class LiteralTruth extends Literal {
  lexeme: string
  value: Boolean
  type = 'truth'
  constructor (value: Boolean) {
    super(String(value), value);
  }
}

const t = new LiteralTruth(true);
const f = new LiteralTruth(false);

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

export class LiteralRef extends Literal {
  type = 'ref'
  value: typeof Proxy
  constructor (x: number, y: number, handler?: ProxyHandler<any>) {
    super(`ref<xy>`, new Proxy(new Vector(x,y), handler || {}))
  }

  render (str) {
    this.lexeme = `ref<${str}>`;
  }
}

export class Direction extends Literal {
  value: Vector
}

const north = new Direction('north', new Vector(0, -1));
const east = new Direction('east', new Vector(1, 0));
const south = new Direction('south', new Vector(0, 1));
const west = new Direction('west', new Vector(-1, 0));

const literals = {};

[t, f, north, east, south, west].forEach((literal) => {
  literals[literal.lexeme] = literal;
})

export default literals;
