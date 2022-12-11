import { debug } from '../shared';
import { Scanner, Token, TokenType } from './lexer';
import { Factor, Term } from './types';
import literals, {
  LiteralNumber, LiteralRef, LiteralRef, LiteralString, LiteralTerm, Quotation,
} from './literals';
import operators, { Operator } from './operators';
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
  quotations: Array<Quotation> = [];

  constructor(dict?: Dictionary) {
    this.dict = {
      ...this.dict,
      ...dict,
      help: new Operator(['help'], [], () => {
        throw new Error(`Available words: ${Object.keys(this.dict).sort().join(', ')}.\n`);
      }),
    };
  }

  compile(code: string): Term {
    this.level = 0;
    this.quotations = [];

    debug('compiling: ', code);
    const tokens = this.scanner.scan(code);
    debug('got tokens:', tokens);
    const term: Term = tokens.reduce(this.newParseToken.bind(this), []);
    if (this.level !== 0) {
      debug('this.level', this.level);
      this.level = 0;
      throw new Error('Unbalanced brackets.');
    }

    return term;
  }

  newParseToken(factors: Array<Factor>, token: Token, index: number) {
    if (token.type === TokenType.LEFT_BRACKET) {
      this.level += 1;
      debug('factors:', factors.map((f) => f.toString()));
      debug('level++ to:', this.level);
      this.quotations[this.level] = new Quotation();
      return factors;
    }

    if (token.type === TokenType.NUMBER) {
      const literalNumber = new LiteralNumber(token.literal);
      if (this.level === 0) {
        factors.push(literalNumber);
      } else {
        this.quotations[this.level].value.push(literalNumber);
      }
      return factors;
    }

    if (token.type === TokenType.STRING) {
      const literalString = new LiteralString(token.literal);
      if (this.level === 0) {
        factors.push(literalString);
      } else {
        this.quotations[this.level].value.push(literalString);
      }
      return factors;
    }

    if (token.type === TokenType.REF) {
      const literalRef = new LiteralRef(token.literal);
      if (this.level === 0) {
        factors.push(literalRef);
      } else {
        this.quotations[this.level].value.push(literalRef);
      }
      return factors;
    }

    if (token.type === TokenType.RIGHT_BRACKET) {
      if (this.level === 1) {
        factors.push(this.quotations[this.level]);
      } else {
        if (!this.quotations[this.level - 1]) {
          throw new Error(']: Unbalanced brackets.');
        }
        this.quotations[this.level - 1].value.push(this.quotations[this.level]);
      }
      this.level -= 1;
      debug('factors:', factors.map((f) => f.toString()));
      debug('level-- to:', this.level);
      return factors;
    }

    if (token.type === TokenType.EOF) {
      return factors;
    }

    if (Object.keys(this.dict).includes(token.lexeme)) {
      const word = this.dict[token.lexeme];
      if (this.level === 0) {
        factors.push(word);
      } else {
        this.quotations[this.level].value.push(word);
      }
      return factors;
    }

    throw new Error(`'${token.lexeme}' is not a recognized word.`);
  }

  // getInnerQuotation(level: number, quotation: Quotation) {
  //   const quotations = (quotation.value || [])
  //     .filter((f) => f instanceof Quotation) as Array<Quotation>;
  //   const indexOfLast = quotations.length - 1;
  //   const nextQuotation = quotations[indexOfLast];
  //   if (!nextQuotation) return quotation;
  //   if (level <= 0) return nextQuotation;
  //   const nextLevel = level - 1;
  //   return this.getInnerQuotation(nextLevel, nextQuotation);
  // }

  // parseToken(term: Array<Factor>, token: Token): Term {
  //   if (!token.lexeme) return term;

  //   debug('parseToken(), term:', term);

  //   let previous = term[term.length - 1];

  //   if (this.level > 0 && previous && previous instanceof Quotation) {
  //     previous = this.getInnerQuotation(this.level, previous);
  //   }

  //   debug('parseToken(), previous factor:', previous);
  //   let factor: Factor | undefined;

  //   if (Object.keys(this.dict).includes(token.lexeme)) {
  //     factor = this.dict[token.lexeme];

  //     if (this.level > 0 && previous instanceof Quotation) {
  //       debug('adding factor to quotation', factor);
  //       previous.add(factor);

  //       factor = undefined;
  //     }
  //   } else {
  //     switch (token.type) {
  //       case TokenType.STRING:
  //         if (this.level > 0 && previous instanceof Quotation) {
  //           debug('adding token to quotation', token);
  //           previous.add(new LiteralString(token.literal));
  //         } else {
  //           debug('adding string to term');
  //           factor = new LiteralString(token.literal as unknown as string);
  //         }
  //         break;
  //       case TokenType.NUMBER:
  //         if (this.level > 0 && previous instanceof Quotation) {
  //           debug('adding token to quotation', token);
  //           previous.add(new LiteralNumber(Number(token.lexeme)));
  //         } else {
  //           debug('adding number to term');
  //           factor = new LiteralNumber(token.literal as unknown as number);
  //         }
  //         break;
  //       case TokenType.REF:
  //         if (this.level > 0 && previous instanceof Quotation) {
  //           debug('adding ref to quotation', token);
  //           previous.add(new LiteralRef(token.literal as unknown as number));
  //         } else {
  //           debug('adding ref to term');
  //           factor = new LiteralRef(token.literal as unknown as number);
  //         }
  //         break;
  //       case TokenType.LEFT_BRACKET:
  //         if (this.level > 0 && previous instanceof Quotation) {
  //           debug('adding token to quotation', token);
  //           previous.add(new Quotation());
  //         } else {
  //           debug('adding quotation to term');
  //           factor = new Quotation();
  //         }
  //         debug('level++');
  //         this.level++;
  //         break;
  //       case TokenType.RIGHT_BRACKET:
  //         debug('level--', 'term:', term);
  //         this.level--;
  //         break;
  //       case TokenType.IDENTIFIER:
  //         if (!factor) {
  //           throw new Error(`'${token.lexeme}' is not a recognized word.`);
  //         }
  //         break;
  //       case TokenType.PLUS:
  //         debug('plus case');
  //         break;
  //       default:
  //         throw new Error(`unrecognized token type: '${token.type}'.`);
  //     }
  //   }

  //   if (factor) term.push(factor);

  //   return term;
  // }
}
