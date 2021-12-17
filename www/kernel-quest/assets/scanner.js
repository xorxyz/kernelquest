// xor shell v0.1
// copyright (c) 2019, 2020, 2021 Jonathan Dupré <jonathan@diagonal.sh>

const Alpha = new RegExp('[a-zA-Z]');
const Digit = new RegExp('[0-9]');
const isAlpha = (c) => c.match(Alpha);
const isDigit = (c) => c.match(Digit);
const isAlphaNumeric = (c) => isAlpha(c) || isDigit(c);
export var TokenType;
(function (TokenType) {
  TokenType.LEFT_BRACKET = '[';
  TokenType.RIGHT_BRACKET = ']';
  TokenType.LEFT_BRACE = '{';
  TokenType.RIGHT_BRACE = '}';
  TokenType.COLON = ':';
  TokenType.SEMICOLON = ';';
  TokenType.DOT = '.';
  TokenType.PLUS = '+';
  TokenType.EQUAL_EQUAL = '==';
  TokenType.IDENTIFIER = 'identifier';
  TokenType.STRING = 'string';
  TokenType.NUMBER = 'number';
  TokenType.EOF = '\0';
}(TokenType || (TokenType = {})));
const keywords = {
  MODULE: 'module',
  PRIVATE: 'private',
  PUBLIC: 'public',
  DEFINE: 'define',
};
export class Token {
  constructor(type, lexeme, literal, line) {
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
  constructor(source) {
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
    this.source = source;
  }
  scan() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    const eof = new Token(TokenType.EOF, '', null, this.line);
    this.tokens.push(eof);
    return this.tokens;
  }
  isAtEnd() {
    return this.current >= this.source.length;
  }
  peek() {
    if (this.isAtEnd()) { return TokenType.EOF; }
    return this.source.charAt(this.current);
  }
  addToken(type, literal) {
    const text = this.source.substring(this.start, this.current);
    const token = new Token(type, text, literal, this.line);
    this.tokens.push(token);
  }
  match(expected) {
    if (this.isAtEnd()) { return false; }
    if (this.source.charAt(this.current) !== expected) { return false; }
    this.current++;
    return true;
  }
  string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') { this.line++; }
      this.next();
    }
    if (this.isAtEnd()) {
      throw new Error('unterminated string.');
    }
    this.next();
    const quoteless = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, quoteless);
  }
  number(negative) {
    while (isDigit(this.peek())) { this.next(); }
    let value = Number(this.source.substring(this.start, this.current));
    if (negative) { value = -value; }
    this.addToken(TokenType.NUMBER, value);
  }
  identifier() {
    while (isAlphaNumeric(this.peek())) { this.next(); }
    const text = this.source.substring(this.start, this.current);
    const type = keywords[text] || TokenType.IDENTIFIER;
    this.addToken(type);
  }
  next() {
    return this.source.charAt(this.current++);
  }
  scanToken() {
    const char = this.next();
    switch (char) {
      case ' ':
      case '\r':
      case '\t':
        break;
      case '\n':
        this.line++;
        break;
      case '-':
        this.next();
        if (isDigit(char)) {
          this.number(true);
        } else {
          throw new Error('expected digit after minus sign');
        }
        break;
      case '"':
        this.string();
        break;
      case TokenType.DOT:
        this.addToken(TokenType.DOT, char);
        break;
      case TokenType.PLUS:
        this.addToken(TokenType.PLUS, char);
        break;
      case TokenType.LEFT_BRACKET:
        this.addToken(TokenType.LEFT_BRACKET, char);
        break;
      case TokenType.RIGHT_BRACKET:
        this.addToken(TokenType.RIGHT_BRACKET, char);
        break;
      case TokenType.SEMICOLON:
        this.addToken(TokenType.SEMICOLON, char);
        break;
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
          throw new Error(`unexpected at line ${this.line}, column ${this.current}: '${char}'`);
        }
        break;
      }
    }
  }
}
