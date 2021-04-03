import { Token, TokenType } from './scanner';
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

1. The i combinator removes a program from the top of the stack and executes it
2. Joy programs are sequences which are excuted by stepping through the members of the sequence

*/

type AtomicSymbol = 1;
type IntegerConstant = 1;
type CharacterConstant = 1;
type StringConstant= 1;

type DefinitionSequence = 1;
type SimpleDefinition = 1;
type CompoundDefinition = 1;

type Factor = (
  AtomicSymbol |
  IntegerConstant |
  CharacterConstant |
  StringConstant
)

export class Parser {
  tokens: Array<Token>
  current = 0

  parse(tokens) {
    this.tokens = tokens;
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

  private match(...types: Array<TokenType>) {
    return types.some((type) => {
      if (this.check(type)) {
        this.next();
        return true;
      }

      return false;
    });
  }

  private factor() {
    if (this.match(TokenType.STRING, TokenType.NUMBER)) {
      const t = this.tokens[this.current];
    }
  }

  private term() {

  }

  // private term(): TermNode {
  //   const node = new TermNode();
  //   let child = this.factor();

  //   while (child) {
  //     node.factors.push(child);
  //     child = this.factor()
  //   }
  //   return node;
  // }

  // private set(): boolean | Set<boolean> {
  //   if (this.match(TokenType.LEFT_BRACE)) {
  //     const members: Array<boolean> = [];
  //     let member = this.match(TokenType.NUMBER)
  //     while (member) {
  //       members.push(member)
  //       member = this.match(TokenType.NUMBER)
  //     }
  //     if (this.match(TokenType.RIGHT_BRACE)) {
  //       return new Set(members);
  //     }
  //   }

  //   return false;
  // }

  // private quotation() {

  // }

  // private factor () {
  //   return (
  //     this.match(TokenType.NUMBER) ||
  //     this.match(TokenType.STRING) ||
  //     this.set() ||
  //     this.quotation() ||
  // }

  // private compoundDefinition() {
  //   // mod MODULE + AtomicSymbol
  //   // priv PRIVATE + DefinitionSequence
  //   // pub PUBLIC || DEFINE || LIBRA + DefinitionSequence
  // }
}
