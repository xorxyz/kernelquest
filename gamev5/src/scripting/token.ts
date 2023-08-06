export enum SymbolToken {
  COLON = ':',
  DOT = '.',
  EOL = '\n',
  EOF = '\0',
  EQUAL_EQUAL = '==',
  EXCLAMATION_EQUAL = '!=',
  LEFT_BRACE = '{',
  LEFT_BRACKET = '[',
  MINUS = '-',
  PERCENT = '%',
  PLUS = '+',
  POUND = '#',
  QUESTION_MARK = '?',
  RIGHT_BRACE = '}',
  RIGHT_BRACKET = ']',
  SEMICOLON = ';',
  SLASH = '/',
  STAR = '*',
  ZERO = '0',
}

export enum SequenceToken {
  ATOM = 'atom',
  COMMENT = 'comment',
  HEX = 'hex',
  IDENTIFIER = 'identifier',
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

  constructor(type: TokenType) {
    this.type = type;
  }
}
