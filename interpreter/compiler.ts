import { Scanner, Token, TokenType } from "./lexer";
import { Factor, Term } from "./types";
import literals, { LiteralNumber, LiteralString, Quotation } from "./literals";
import operators from "./operators";
import combinators from "./combinators";
import { debug } from "../app/src/utils";

export type Dictionary = Record<string, Factor>

export class Compiler {
  private scanner = new Scanner()
  tokens: Array<Token>
  dict: Dictionary = {
    ...literals,
    ...operators,
    ...combinators
  }
  level = 0

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

  parseToken (term: Array<Factor>, token: Token): Term {
    if (!token.lexeme) return term;

    let factor: Factor | undefined;
    let previous = term[term.length - 1];
  
    debug('parsing token: ', token);

    if (Object.keys(this.dict).includes(token.lexeme)) {
      factor = this.dict[token.lexeme];

      if (this.level > 0 && previous instanceof Quotation) {
        debug('adding token to quotation');
        previous.add(factor);
      } else {
        debug('adding string to term');
        term.push(factor);
      }
    }

    console.log('factor?', factor)

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
      default:
        throw new Error(`unrecognized token type: '${token.type}'`);
    }

    if (factor) term.push(factor);
    
    debug('now at level:', this.level);

    return term;
  }
}