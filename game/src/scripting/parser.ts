import { ParsingError } from '../shared/errors';
import {
  isAlpha, isAlphaNumeric, isCapital, isDigit, isLegalIdentifier,
} from '../shared/util';
import { SequenceToken, SymbolToken, Token } from './token';

export class Parser {
  private text: string;

  private current = 0;

  private line = 1;

  private start = 0;

  private tokens: Token[] = [];

  constructor(text: string) {
    this.text = this.cleanText(text);
  }

  get finished(): boolean {
    return this.current >= this.text.length;
  }

  parse(): Token[] {
    while (!this.finished) {
      this.start = this.current;
      this.parseSequence();
    }

    return [...this.tokens, new Token(SymbolToken.EOF, '')];
  }

  private parseSequence(): void {
    const char = this.nextCharacter();

    switch (char) {
      case SymbolToken.SPACE:
      case SymbolToken.TAB:
        // Spaces and tabs don't have any meaning
        this.noop();
        break;
      case SymbolToken.LINE_FEED:
        this.newLine();
        break;
      case SymbolToken.DOUBLE_QUOTE:
        this.string();
        break;
      case SymbolToken.MINUS:
        this.minus();
        break;
      case SymbolToken.QUESTION_MARK:
        this.variable();
        break;
      case SymbolToken.AMPERSAND:
        this.ref();
        break;
      case SymbolToken.POUND:
        this.comment();
        break;
      case SymbolToken.LEFT_SQUARE_BRACKET:
        this.tokens.push(new Token(SymbolToken.LEFT_SQUARE_BRACKET, char));
        break;
      case SymbolToken.RIGHT_SQUARE_BRACKET:
        this.tokens.push(new Token(SymbolToken.RIGHT_SQUARE_BRACKET, char));
        break;
      case SymbolToken.DOT:
        this.tokens.push(new Token(SymbolToken.DOT, char));
        break;
      case SymbolToken.PLUS:
        this.tokens.push(new Token(SymbolToken.PLUS, char));
        break;
      case SymbolToken.STAR:
        this.tokens.push(new Token(SymbolToken.STAR, char));
        break;
      case SymbolToken.SLASH:
        this.tokens.push(new Token(SymbolToken.SLASH, char));
        break;
      case SymbolToken.EQUAL:
        this.equal();
        break;
      case SymbolToken.EXCLAMATION:
        this.exclamation();
        break;
      default:
        if (isDigit(char)) {
          this.number(char);
          break;
        }
        if (isCapital(char)) {
          this.type();
          break;
        }
        if (isAlpha(char)) {
          this.identifier();
          break;
        }
        throw new ParsingError(`Unexpected at line ${this.line}, column ${this.current}: '${char}'`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, class-methods-use-this
  private noop(): void {}

  private newLine(): void {
    this.line += 1;
  }

  private equal(): void {
    this.scanUntilBoundary();

    const text = this.text.substring(this.start, this.current);

    if (text === SymbolToken.EQUAL_EQUAL as string) {
      this.tokens.push(new Token(SymbolToken.EQUAL_EQUAL, SymbolToken.EQUAL_EQUAL as string));
      return;
    }

    throw new ParsingError(`${text} is illegal.`);
  }

  private exclamation(): void {
    const next = this.peek();

    if (next === SymbolToken.EQUAL as string) {
      this.tokens.push(
        new Token(SymbolToken.EXCLAMATION_EQUAL, SymbolToken.EXCLAMATION_EQUAL as string),
      );
    } else {
      throw new ParsingError('Single exclamation point is illegal.');
    }
  }

  private string(): void {
    while (this.peek() !== (SymbolToken.DOUBLE_QUOTE as string) && !this.finished) {
      if (this.peek() === SymbolToken.CARRIAGE_RETURN as string) {
        this.line += 1;
      }
      this.nextCharacter();
    }

    if (this.finished) {
      throw new ParsingError('Unterminated string.');
    }

    // get the final quote
    this.nextCharacter();

    const quoteless = this.text.substring(this.start + 1, this.current - 1);
    this.tokens.push(new Token(SequenceToken.STRING, quoteless));
  }

  private minus(): void {
    const next = this.peek();

    // Negative number
    if (isDigit(next)) {
      this.number('-');
      return;
    }

    // Subtraction
    if ([SymbolToken.EOF as string, SymbolToken.SPACE as string].includes(next)) {
      this.tokens.push(new Token(SymbolToken.MINUS, SymbolToken.MINUS as string));
      return;
    }

    throw new ParsingError('Minus sign can only be followed by a number or a space.');
  }

  private number(char: string): void {
    if (char === '0' && this.peek() === 'x') {
      this.hex();
      return;
    }

    while (isDigit(this.peek())) this.nextCharacter();

    let value = Number(this.text.substring(this.start, this.current));

    if (Number.isNaN(value)) {
      throw new ParsingError(`Value is not a number: '${value}'.`);
    }

    this.tokens.push(new Token(SequenceToken.NUMBER, String(value)));
  }

  private type(): void {
    this.scanUntilBoundary();

    const text = this.text.substring(this.start + 1, this.current);
    const parts = text.split(':');

    if (parts.length > 2 || parts.some((part): boolean => !isAlphaNumeric(part))) {
      throw new ParsingError(`${text} is not a valid type.`);
    }

    this.tokens.push(new Token(SequenceToken.TYPE, text));
  }

  private identifier(): void {
    this.scanUntilBoundary();

    const text = this.text.substring(this.start, this.current);

    if (!isLegalIdentifier(text)) {
      throw new ParsingError(`Identifier ${text} contains illegal characters.`);
    }

    if (text.startsWith('-')) {
      throw new ParsingError('Identifier cannot start with a dash.');
    }

    this.tokens.push(new Token(SequenceToken.WORD, text));
  }

  private ref(): void {
    this.scanUntilBoundary();

    const text = this.text.substring(this.start + 1, this.current);
    const n = Number(`0x${text}`);

    if (Number.isNaN(n)) {
      throw new ParsingError('Ref should be a hex string');
    }

    this.tokens.push(new Token(SequenceToken.IDEA, String(n)));
  }

  private hex(): void {
    this.scanUntilBoundary();

    const text = `0${this.text.substring(this.start + 1, this.current)}`;
    const n = Number(text);

    if (Number.isNaN(n)) {
      throw new ParsingError(`Parsing error: ${text} is not a valid hex number.`);
    }

    this.tokens.push(new Token(SequenceToken.HEX, text));
  }

  private variable(): void {
    this.scanUntilBoundary();

    const text = this.text.substring(this.start + 1, this.current);

    if (!text.length && !isAlphaNumeric(text)) {
      throw new ParsingError(`'${text}' is not a valid pattern variable name.`);
    }

    this.tokens.push(new Token(SequenceToken.VARIABLE, text));
  }

  private comment(): void {
    while (this.peek() !== SymbolToken.CARRIAGE_RETURN as string && !this.finished) {
      this.nextCharacter();
    }

    const text = this.text.substring(this.start + 1, this.current);

    this.tokens.push(new Token(SequenceToken.COMMENT, text));
  }

  private peek(): string | SymbolToken {
    if (this.finished) return SymbolToken.EOF;
    return this.text.charAt(this.current);
  }

  private nextCharacter(): string {
    const char = this.text.charAt(this.current);
    this.current += 1;
    return char;
  }

  private scanUntilBoundary(): void {
    while (
      this.peek() !== SymbolToken.SPACE as string
      && this.peek() !== SymbolToken.RIGHT_SQUARE_BRACKET as string
      && !this.finished) {
      this.nextCharacter();
    }
  }

  private cleanText(text: string): string {
    return text
      // Replace every CRLF with LF
      .replace(/\r\n/g, '\n')
      // Replace every CR with LF
      .replace(/\r/g, '\n');
  }
}
