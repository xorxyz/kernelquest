import { operatorTokens, Scanner, Token, TokenType } from "./lexer";
import { Dictionary, Factor, IProgram } from "./types";
import { LiteralNumber, LiteralString, Quotation } from "./stdlib/literals";
import operators from "./stdlib/operators";
import combinators from "./stdlib/combinators";

export class Compiler {
  private scanner = new Scanner()
  tokens: Array<Token>
  dict: Dictionary = {
    ...operators,
    ...combinators
  }

  compile(code: string, recursive?: boolean): IProgram {
    console.log('compiling: ', code);
    const tokens = this.scanner.scan(code);
    console.log('got tokens:', tokens);
    const term: Array<Factor> = tokens.reduce((arr: Array<Factor>, token: Token) => {
      if (!token.lexeme) return arr;
      console.log('token:', token);

      if (typeof token.literal !== 'undefined') {
        if (operatorTokens.includes(token.lexeme)) {
          const factor = this.dict[token.lexeme];

          if (!factor) throw new Error('factor not found: ' + token.lexeme);
          arr.push(factor);
          return arr;
        } else if (token.type === TokenType.STRING) {
          const literal = new LiteralString(token.literal as unknown as string);
          arr.push(literal);
          return arr;
        } else if (token.type === TokenType.NUMBER) {
          const literal = new LiteralNumber(token.literal as unknown as number);
          arr.push(literal);
          return arr;
        } else if (token.type === TokenType.QUOTATION) {
          if (recursive) throw new Error('only one level of recursion allowed');
          if (!token.literal || typeof token.literal !== 'string') {
            throw new Error('quotation missing token.literal');
          }
          const compiler = new Compiler();
          console.log('compiler', compiler);
          const program = compiler.compile(dequote(token.literal || '[]'), true);
          console.log('program', program);
          const literal = new Quotation(program);
          console.log('literal', literal);
          arr.push(literal);
          return arr;
        } else {
          throw new Error('unhandled case oops');
        }
      } else {
        console.log('token', token)
        const factor = this.dict[token.lexeme];
        console.log('token', token)
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

function dequote (quoted: string) {
  console.log('quoted', quoted);
  const dequoted = quoted.split('').slice(1).slice(0, -1).join('').trim();
  console.log('dequoted', dequoted);
  return dequoted
}
