import { operatorTokens, Scanner, Token } from "./lexer";
import { Dictionary, Factor, IProgram } from "./types";
import { LiteralNumber, LiteralString } from "./stdlib/literals";
import operators from "./stdlib/operators";
import combinators from "./stdlib/combinators";

export class Compiler {
  private scanner = new Scanner()
  tokens: Array<Token>
  dict: Dictionary = {
    ...operators,
    ...combinators
  }

  compile(code: string): IProgram {
    const tokens = this.scanner.scan(code);
    const term: Array<Factor> = tokens.reduce((arr: Array<Factor>, token: Token) => {
      if (!token.lexeme) return arr;

      if (typeof token.literal !== 'undefined') {
        if (operatorTokens.includes(token.lexeme)) {
          const factor = this.dict[token.lexeme];

          if (!factor) throw new Error('factor not found: ' + token.lexeme)
          arr.push(factor);
          return arr
        } else if (typeof token.literal === 'string') {
          const literal = new LiteralString(token.literal);
          arr.push(literal);
          return arr
        } else if (typeof token.literal === 'number') {
          const literal = new LiteralNumber(token.literal);
          arr.push(literal);
          return arr
        } else {
          throw new Error('unhandled case oops')
        }
      } else {
        const factor = this.dict[token.lexeme];
        if (!factor) throw new Error('factor not found: ' + token.lexeme)
        arr.push(factor);
        return arr
      }
    }, []);

    return { 
      tokens, 
      term
    };
  }
}
