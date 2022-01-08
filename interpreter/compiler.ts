import { debug } from 'xor4-lib/utils';
import { Scanner, Token, TokenType } from './lexer';
import { Factor, Term } from './types';
import literals, { LiteralNumber, LiteralString, Quotation } from './literals';
import operators from './operators';
import combinators from './combinators';
import syscalls from './syscalls';

export type Dictionary = Record<string, Factor>

export class Compiler {
  private scanner = new Scanner();
  tokens: Array<Token>;
  dict: Dictionary = {
    ...literals,
    ...operators,
    ...combinators,
    ...syscalls,
  };
  level = 0;

  compile(code: string): Term {
    debug('compiling: ', code);
    const tokens = this.scanner.scan(code);
    debug('got tokens:', tokens);
    const term: Array<Factor> = tokens.reduce(this.parseToken.bind(this), []);
    if (this.level !== 0) {
      console.log('this.level', this.level);
      this.level = 0;
      throw new Error('unbalanced brackets');
    }

    return term;
  }

  parseToken(term: Array<Factor>, token: Token): Term {
    if (!token.lexeme) return term;

    const previous = term[term.length - 1];
    let factor: Factor | undefined;
    console.log(this.dict);

    if (Object.keys(this.dict).includes(token.lexeme)) {
      factor = this.dict[token.lexeme];

      if (this.level > 0 && previous instanceof Quotation) {
        previous.add(factor);
      }
    } else {
      switch (token.type) {
        case TokenType.STRING:
          if (this.level > 0 && previous instanceof Quotation) {
            debug('adding token to quotation');
            previous.add(new LiteralString(token.lexeme));
          } else {
            debug('adding string to term');
            factor = new LiteralString(token.literal as unknown as string);
          }
          break;
        case TokenType.NUMBER:
          if (this.level > 0 && previous instanceof Quotation) {
            debug('adding token to quotation', token);
            previous.add(new LiteralNumber(Number(token.lexeme)));
          } else {
            debug('adding number to term');
            factor = new LiteralNumber(token.literal as unknown as number);
          }
          break;
        case TokenType.LEFT_BRACKET:
          if (this.level > 0 && previous instanceof Quotation) {
            debug('adding token to quotation', token);
            previous.add(new Quotation());
          } else {
            debug('adding quotation to term');
            factor = new Quotation();
          }
          this.level++;
          break;
        case TokenType.RIGHT_BRACKET:
          console.log('TERM', term);
          this.level--;
          break;
        case TokenType.IDENTIFIER:
          if (!factor) {
            throw new Error(`'${token.lexeme}' is not a recognized word`);
          }
          break;
        case TokenType.PLUS:
          console.log('plus case');
          break;
        default:
          throw new Error(`unrecognized token type: '${token.type}'`);
      }
    }

    if (factor) term.push(factor);

    return term;
  }
}
