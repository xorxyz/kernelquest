const AlphaNumeric = /^[a-zA-Z0-9]*$/;
const Alpha = /^[a-zA-Z]*$/;
const Digit = /^[0-9]*$/;
export const isAlphaNumeric = (str: string) => str.match(AlphaNumeric);
export const isAlpha = (str: string) => str.match(Alpha);
export const isDigit = (str: string) => str.match(Digit);

// eslint-disable-next-line no-shadow
export enum TokenType {
  LEFT_BRACKET = '[',
  RIGHT_BRACKET = ']',
  LEFT_BRACE = '{',
  RIGHT_BRACE = '}',
  COLON = ':',
  SEMICOLON = ';',
  DOT = '.',
  PLUS = '+',
  MINUS = '-',
  STAR = '*',
  SLASH = '/',
  EQUAL_EQUAL = '==',
  IDENTIFIER = 'identifier',
  STRING = 'string',
  NUMBER = 'number',
  EOF = '\0',
  QUOTATION = 'quotation',
  ATOM = 'atom',
  REF = 'ref'
}

const keywords = {
  MODULE: 'module',
  PRIVATE: 'private',
  PUBLIC: 'public',
  DEFINE: 'define',
};

export class Token {
  type: TokenType;
  lexeme: string;
  literal?: object;
  line: number;

  constructor(type: TokenType, lexeme: string, literal: any, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;

    if (type !== 'string' && type !== 'number') {
      Object.defineProperty(this, 'literal', {
        enumerable: false,
      });
    } else {
      Object.defineProperty(this, 'lexeme', {
        enumerable: false,
      });
    }
  }

  toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}

export class Scanner {
  source: string;
  tokens: Array<Token> = [];
  start = 0;
  current = 0;
  line = 1;

  scan(code: string): Array<Token> {
    this.source = code;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;

    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    const eof = new Token(TokenType.EOF, '', null, this.line);

    this.tokens.push(eof);

    return this.tokens;
  }

  private isAtEnd() {
    return this.current >= this.source.length;
  }

  private peek() {
    if (this.isAtEnd()) return TokenType.EOF;
    return this.source.charAt(this.current);
  }

  private addToken(type: TokenType, literal?) {
    const text = this.source.substring(this.start, this.current);
    const token = new Token(type, text, literal, this.line);

    this.tokens.push(token);
  }

  private match(expected: string) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;

    this.current++;
    return true;
  }

  private string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      this.next();
    }

    if (this.isAtEnd()) {
      throw new Error('unterminated string.');
    }

    // get the final quote
    this.next();

    const quoteless = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, quoteless);
  }

  private number(negative?: boolean) {
    while (isDigit(this.peek())) this.next();

    let value = Number(this.source.substring(this.start, this.current));
    if (negative) value = -value;
    this.addToken(TokenType.NUMBER, value);
  }

  private identifier() {
    while (isAlphaNumeric(this.peek())) this.next();

    const text = this.source.substring(this.start, this.current);
    const type = keywords[text] || TokenType.IDENTIFIER;
    this.addToken(type);
  }

  private ref() {
    while (this.peek() !== ' ' && !this.isAtEnd()) {
      this.next();
    }

    const text = this.source.substring(this.start + 1, this.current);
    const n = Number(text);

    if (Number.isNaN(n)) {
      throw new Error('Ref should be a positive number');
    }

    this.addToken(TokenType.REF, n);
  }

  private next() {
    return this.source.charAt(this.current++);
  }

  private scanToken() {
    const char = this.next();
    let nextChar: string;

    switch (char) {
      case ' ':
      case '\r':
      case '\t':
        break;
      case '\n':
        this.line++;
        break;
      case '"': this.string(); break;
      case TokenType.DOT: this.addToken(TokenType.DOT, char); break;
      case TokenType.PLUS: this.addToken(TokenType.PLUS, char); break;
      case TokenType.STAR: this.addToken(TokenType.STAR, '*'); break;
      case '&': this.ref(); break;
      case TokenType.MINUS:
        nextChar = this.peek();
        // negative number
        if (isDigit(nextChar)) {
          this.number(true);
        // subtraction
        } else if ([TokenType.EOF, ' '].includes(nextChar)) {
          this.addToken(TokenType.MINUS, char);
        } else {
          throw new Error('minus sign can only be followed by a number or a space');
        }
        break;
      case TokenType.SLASH: this.addToken(TokenType.SLASH, char); break;
      case TokenType.LEFT_BRACKET:
        this.addToken(TokenType.LEFT_BRACKET, char);
        break;
      case TokenType.RIGHT_BRACKET:
        this.addToken(TokenType.RIGHT_BRACKET, char);
        break;
      case TokenType.SEMICOLON: this.addToken(TokenType.SEMICOLON, char); break;
      case '=':
        if (this.match('=')) {
          this.addToken(TokenType.EQUAL_EQUAL, char);
        } else {
          throw new Error('single \'=\' is illegal');
        }
        break;
      default: {
        if (isDigit(char)) {
          this.number();
        } else if (isAlpha(char)) {
          this.identifier();
        } else {
          throw new Error(
            `unexpected at line ${this.line}, column ${this.current}: '${char}'`,
          );
        }
        break;
      }
    }
  }
}
