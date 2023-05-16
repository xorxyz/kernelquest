import { Scanner, Token, TokenType } from './lexer';
import { Factor, Term } from './types';
import {
  LiteralHex,
  LiteralNumber, 
  LiteralRef, 
  LiteralString, 
  LiteralTruth, 
  LiteralType, 
  Variable, 
  Quotation, 
  TypeNames,
} from './literals';
import operators, { createUnknownWord, Operator } from './operators';
import combinators from './combinators';

export type Dictionary = Record<string, Factor>

export class Compiler {
  private scanner = new Scanner();
  tokens: Array<Token>;
  dict: Dictionary = {
    true: new LiteralTruth(true),
    false: new LiteralTruth(false),
    ...operators,
    ...combinators,
  };
  level = 0;
  quotations: Array<Quotation> = [];

  constructor(dict: Dictionary = {}) {
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

    const tokens = this.scanner.scan(code);
    const term: Term = tokens.reduce(this.newParseToken.bind(this), []);
    if (this.level !== 0) {
      this.level = 0;
      throw new Error('Unbalanced brackets.');
    }

    return term;
  }

  newParseToken(factors: Array<Factor>, token: Token) {
    if (token.type === TokenType.LEFT_BRACKET) {
      this.level += 1;
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

    if (token.type === TokenType.HEX) {
      const literalHex = new LiteralHex(token.literal);
      if (this.level === 0) {
        factors.push(literalHex);
      } else {
        this.quotations[this.level].value.push(literalHex);
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
      const closingQuotation = Quotation.from(this.quotations[this.level].value);

      if (this.level === 1) {
        factors.push(closingQuotation);
      } else {
        if (!this.quotations[this.level - 1]) {
          throw new Error(']: Unbalanced brackets.');
        }
        this.quotations[this.level - 1].value.push(closingQuotation);
      }
      this.level -= 1;
      return factors;
    }

    if (token.type === TokenType.EOF) {
      return factors;
    }

    if (token.type === TokenType.COMMENT) {
      console.log(`Comment: #${token.literal}`);
      return factors;
    }

    if (token.type === TokenType.VARIABLE) {
      const variable = new Variable(token.literal);
      if (this.level === 0) {
        factors.push(variable);
      } else {
        this.quotations[this.level].value.push(variable);
      }
      return factors;
    }

    if (token.type === TokenType.TYPE) {
      const parts = token.lexeme.split(':');
      const lower = parts[0].toLowerCase();
      if (!TypeNames.includes(lower)) {
        throw new Error(parts[0] + ' is not a valid type.')
      }
      const literalType = new LiteralType(token.lexeme, lower, parts[1]);
      if (this.level === 0) {
        factors.push(literalType);
      } else {
        this.quotations[this.level].value.push(literalType);
      }
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

    const unknownWord = createUnknownWord(token.lexeme);

    if (this.level === 0) {
      factors.push(unknownWord);
    } else {
      this.quotations[this.level].value.push(unknownWord);
    }
    return factors;

    // throw new Error(`'${token.lexeme}' is not a recognized word.`);
  }
}
