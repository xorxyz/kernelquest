// eslint-disable-next-line import/no-unresolved
import { Token, TokenType } from './scanner.js';
/*
factor ::=
  atomic-symbol | integer-constant | character-constant | string-constant
  | "{" { character-constant | integer-constant } "}"
  | "[" term "]"
term ::=
  { factor }
literal ::=
  "true" | "false"
  | integer-constant | character-constant | string-constant
  | "{" { character-constant | integer-constant } "}"

definition ::=
  atomic-symbol "==" term

definition-sequence ::= definition { ";" definition }

compound-definition ::=
  [ "MODULE" atomic-symbol ]
  [ "PRIVATE" definition-sequence ]
  [ "PUBLIC" definition-sequence ]
  [ "." ]

cycle (request, or command) ::=
  { compound-definition | term ( "." ) }
*/

export class Parser {
  tokens: Array<Token>
  current = 0

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  parse() {

  }

  private next() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd() {
    return typeof this.peek() === typeof TokenType.EOF;
  }

  private peek() {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private check(type: TokenType) {
    if (this.isAtEnd()) return false;
    return typeof this.peek() === typeof type;
  }
}
