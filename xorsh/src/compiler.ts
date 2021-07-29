import { Stack } from "../../lib/stack";
import { Execution, Thing } from "./interpreter";

const AlphaNumeric = new RegExp('^[a-zA-Z0-9]*$');
const Alpha = new RegExp('^[a-zA-Z]*$');
const Digit = new RegExp('^[0-9]*$');
const isAlphaNumeric = (str: string) => str.match(AlphaNumeric);
const isAlpha = (str: string) => str.match(Alpha);
const isDigit = (str: string) => str.match(Digit);

export enum TokenType {
  LEFT_BRACKET = '[',
  RIGHT_BRACKET = ']',
  LEFT_BRACE = '{',
  RIGHT_BRACE = '}',
  COLON = ':',
  SEMICOLON = ';',
  DOT = '.',
  PLUS = '+',
  EQUAL_EQUAL = '==',
  IDENTIFIER = 'identifier',
  STRING = 'string',
  NUMBER = 'number',
  EOF = '\0'
}

const keywords = {
  MODULE: 'module',
  PRIVATE: 'private',
  PUBLIC: 'public',
  DEFINE: 'define',
};

export class Token {
  type: TokenType
  lexeme: string
  literal?: object
  line: number

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
  source: string
  tokens: Array<Token> = []
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

  private next() {
    return this.source.charAt(this.current++);
  }

  private scanToken() {
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
      case '"': this.string(); break;
      case TokenType.DOT: this.addToken(TokenType.DOT, char); break;
      case TokenType.PLUS: this.addToken(TokenType.PLUS, char); break;
      case TokenType.LEFT_BRACKET: this.addToken(TokenType.LEFT_BRACKET, char); break;
      case TokenType.RIGHT_BRACKET: this.addToken(TokenType.RIGHT_BRACKET, char); break;
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

const literals = ['true', 'false', 'number', 'char', 'string'];
const types = {
  '[': 'lparen()',
  ']': 'rparen()',
  '+': 'add()',
  '.': 'period()',
  '\0': 'eof()',
};


export abstract class Transform {
  token: Token
  constructor (token: Token) {
    this.token = token;
  }
  abstract fn(this: Execution, stack: Stack<Thing>, token: Token): void
}

abstract class Effect extends Transform {}

export class Literal extends Transform {
  fn(stack: Stack<Thing>, token: Token) {
    stack.push(token.literal);
  }
}

abstract class RuntimeError extends Error {}

class MissingOperand extends RuntimeError {}
class WrongInputType extends RuntimeError {}

export class Add extends Transform {
  fn(this: Execution) {
    const b = this.stack.pop();
    if (typeof b === 'undefined') throw new MissingOperand();
    if (typeof b !== 'number') throw new WrongInputType();

    const a = this.stack.pop();
    if (typeof a === 'undefined') throw new MissingOperand();
    if (typeof a !== 'number') throw new WrongInputType();

    const result = a + b;

    this.stack.push(result);
  }
}


export class Compiler {
  private scanner = new Scanner()
  tokens: Array<Token>

  compile(code: string) {
    const tokens = this.scanner.scan(code);
    const transforms: Array<Transform> = [];

    tokens.forEach((token) => {
      if (token.type === 'number') {
        transforms.push(new Literal(token))
      }

      if (token.lexeme === 'add') {
        transforms.push(new Add(token));
      }
    });

    return { tokens, transforms };
  }
}
