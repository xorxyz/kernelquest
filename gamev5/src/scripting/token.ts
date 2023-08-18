export enum SymbolToken {
  AMPERSAND = '&',
  CARRIAGE_RETURN = '\r',
  COLON = ':',
  DOT = '.',
  DOUBLE_QUOTE = '"',
  EOF = '\0',
  EQUAL = '=',
  EQUAL_EQUAL = '==',
  EXCLAMATION = '!',
  EXCLAMATION_EQUAL = '!=',
  LEFT_CURLY_BRACE = '{',
  LEFT_SQUARE_BRACKET = '[',
  LINE_FEED = '\n',
  MINUS = '-',
  PERCENT = '%',
  PLUS = '+',
  POUND = '#',
  QUESTION_MARK = '?',
  RIGHT_CURLY_BRACE = '}',
  RIGHT_SQUARE_BRACKET = ']',
  SEMICOLON = ';',
  SLASH = '/',
  SPACE = ' ',
  STAR = '*',
  TAB = '\t',
  ZERO = '0',
}

export enum SequenceToken {
  ATOM = 'atom',
  COMMENT = 'comment',
  HEX = 'hex',
  WORD = 'word',
  NUMBER = 'number',
  STRING = 'string',
  QUOTATION = 'quotation',
  REF = 'ref',
  TYPE = 'type',
  VARIABLE = 'variable',
}

export type TokenType = SymbolToken | SequenceToken

export class Token {
  readonly type: TokenType;

  readonly lexeme: string;

  constructor(type: TokenType, lexeme: string) {
    this.type = type;
    this.lexeme = lexeme;
  }
}
