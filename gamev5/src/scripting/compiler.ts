import { CompilationError } from '../shared/errors';
import { Atom } from './atom';
import { Dictionary } from './dictionary';
import { Expression } from './expression';
import { LiteralHex } from './literals/hex';
import { LiteralNumber } from './literals/number';
import { LiteralQuotation } from './literals/quotation';
import { LiteralRef } from './literals/ref';
import { LiteralString } from './literals/string';
import { Parser } from './parser';
import { SequenceToken, SymbolToken, Token } from './token';

export class Compiler {
  private atoms: Atom[] = [];

  private dictionary: Dictionary;

  private done = false;

  private level = 0;

  private quotations: LiteralQuotation[] = [];

  private text: string;

  constructor(dictionary: Dictionary, text: string) {
    this.dictionary = dictionary;
    this.text = text;
  }

  compile(): Expression {
    const parser = new Parser(this.text);
    const tokens = parser.parse();

    tokens.forEach((token): void => {
      if (this.done) return;
      this.compileToken(token);
    });

    const expression = new Expression(this.text, this.atoms);

    return expression;
  }

  private compileToken(token: Token): void {
    switch (token.type) {
      case SymbolToken.LEFT_SQUARE_BRACKET:
        this.startQuotation();
        break;
      case SymbolToken.RIGHT_SQUARE_BRACKET:
        this.endQuotation();
        break;
      case SequenceToken.STRING:
        this.add(new LiteralString(token.lexeme));
        break;
      case SequenceToken.NUMBER:
        this.add(new LiteralNumber(token.lexeme));
        break;
      case SequenceToken.HEX:
        this.add(new LiteralHex(token.lexeme));
        break;
      case SequenceToken.REF:
        this.add(new LiteralRef(token.lexeme));
        break;
      default:
        break;
    }
  }

  private add(atom: Atom): void {
    if (this.level === 0) {
      this.atoms.push(atom);
      return;
    }

    const currentQuotation = this.quotations[this.level];

    if (!currentQuotation) {
      throw new CompilationError(`(add) No quotation at index ${this.level}.`);
    }

    currentQuotation.push(atom);
  }

  private startQuotation(): void {
    this.level += 1;
  }

  private endQuotation(): void {
    const currentQuotation = this.quotations[this.level];
    if (!currentQuotation) {
      throw new CompilationError(`(endQuotation) Current quotation not found (index ${this.level})`);
    }

    const previousQuotation = this.quotations[this.level - 1];
    if (!previousQuotation) {
      throw new CompilationError(`(endQuotation) Previous quotation not found (index ${this.level})`);
    }

    previousQuotation.push(currentQuotation);
    this.level -= 1;
  }
}
