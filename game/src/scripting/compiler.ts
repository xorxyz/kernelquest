import { CompilationError } from '../shared/errors';
import { Atom } from './atom';
import { Dictionary } from './dictionary';
import { Expression } from './expression';
import { Quotation } from './types/quotation';
import { Parser } from './parser';
import { SequenceToken, SymbolToken, Token } from './token';
import { StringType } from './types/string';
import { NumberType } from './types/number';
import { HexType } from './types/hex';
import { Idea } from './types/idea';
import { LiteralType } from './types/type';
import { VariableType } from './types/variable';
import { Word } from './types/word';
import { logger } from '../shared/logger';

export class Compiler {
  private atoms: Atom[] = [];

  private dictionary: Dictionary;

  private done = false;

  private level = 0;

  private quotations: Quotation[] = [];

  private text = '';

  constructor(dictionary: Dictionary) {
    this.dictionary = dictionary;
  }

  compile(text: string): Expression {
    this.text = text;
    this.atoms = [];
    this.done = false;
    this.level = 0;
    this.quotations = [];

    const parser = new Parser(this.text);
    const tokens = parser.parse();

    tokens.forEach((token): void => {
      if (this.done) return;
      this.compileToken(token);
    });

    if (this.level !== 0) {
      throw new CompilationError('Unbalanced square brackets.');
    }

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
        this.add(new StringType(token.lexeme));
        break;
      case SequenceToken.NUMBER:
        this.add(new NumberType(Number(token.lexeme)));
        break;
      case SequenceToken.HEX:
        this.add(new HexType(Number(token.lexeme)));
        break;
      case SequenceToken.IDEA:
        this.add(new Idea(Number(token.lexeme)));
        break;
      case SequenceToken.TYPE:
        this.add(new LiteralType(token.lexeme));
        break;
      case SequenceToken.VARIABLE:
        this.add(new VariableType(token.lexeme));
        break;
      case SequenceToken.WORD:
        this.add(new Word(token.lexeme));
        break;
      case SymbolToken.DOT:
      case SymbolToken.PLUS:
      case SymbolToken.MINUS:
      case SymbolToken.STAR:
      case SymbolToken.SLASH:
        this.add(new Word(token.lexeme));
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
    this.quotations[this.level] = new Quotation();
  }

  private endQuotation(): void {
    const currentQuotation = this.quotations[this.level];
    if (!currentQuotation) {
      throw new CompilationError(`(endQuotation) Current quotation not found (index ${this.level})`);
    }

    if (this.level === 1) {
      this.atoms.push(currentQuotation);
    } else {
      const previousQuotation = this.quotations[this.level - 1];
      if (!previousQuotation) {
        throw new CompilationError(`(endQuotation) Previous quotation not found (index ${this.level})`);
      }
      previousQuotation.push(currentQuotation);
    }

    this.level -= 1;
  }
}
