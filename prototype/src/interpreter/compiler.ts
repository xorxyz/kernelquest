import { Scanner, Token, TokenType } from "./lexer";
import { Dictionary, Factor, IProgram, Literal, Term } from "./types";
import literals, { LiteralNumber, LiteralString, Quotation } from "./stdlib/literals";
import operators from "./stdlib/operators";
import combinators from "./stdlib/combinators";

export class Compiler {
  private scanner = new Scanner()
  tokens: Array<Token>
  dict: Dictionary = {
    ...literals,
    ...operators,
    ...combinators
  }
  level = 0

  compile(code: string): IProgram {
    console.log('compiling: ', code);
    const tokens = this.scanner.scan(code);
    console.log('got tokens:', tokens);
    const term: Array<Factor> = tokens.reduce(this.parseToken.bind(this), []);
    this.level = 0;

    return { 
      tokens, 
      term
    };
  }

  parseToken (term: Array<Factor>, token: Token, index: number): Term {
    if (!token.lexeme) return term;

    let literal: Literal
    const previous = term[term.length - 1]
  
    console.log('parsing token: ', token);
    console.log('level:', this.level);

    if (Object.keys(this.dict).includes(token.lexeme)) {
      const factor = this.dict[token.lexeme];

      if (this.level > 0 && previous instanceof Quotation) {
        console.log('adding token to quotation');
        previous.push(token);
      } else {
        console.log('adding string to term');
        term.push(factor);
      }

      return term;
    }

    switch (token.type) {
      case TokenType.STRING: 
        if (this.level > 0 && previous instanceof Quotation) {
          console.log('adding token to quotation');
          previous.push(token);
        } else {
          console.log('adding string to term');
          literal = new LiteralString(token.literal as unknown as string);
          term.push(literal);
        }
        break;
      case TokenType.NUMBER: 
        if (this.level > 0 && previous instanceof Quotation) {
          console.log('adding token to quotation', token);
          previous.push(token);
        } else {
          console.log('adding number to term');
          literal = new LiteralNumber(token.literal as unknown as number);
          term.push(literal);
        }
        break;
      case TokenType.LEFT_BRACKET:
        if (this.level > 0 && previous instanceof Quotation) {
          console.log('adding token to quotation', token);
          previous.push(token);
        } else {
          console.log('adding quotation to term');
          literal = new Quotation();
          term.push(literal);
        }
        this.level++;
        break;
      case TokenType.RIGHT_BRACKET:
        if (this.level === 1 && previous instanceof Quotation) {
          console.log('closing quotation');
          this.level = 0;
        } else if (previous instanceof Quotation) {
          console.log('adding token to quotation', token);
          previous.push(token);
          this.level--;
        } else {
          throw new Error('unhandled right bracket case');
        }
        break;
      default:
        throw new Error(`unrecognized token type: '${token.type}'`);
    }

    return term;
  }
}
