import { Scanner, Token, TokenType } from './scanner';

const literals = ['true', 'false', 'number', 'char', 'string'];
const types = {
  '[': 'lparen()',
  ']': 'rparen()',
  '+': 'add()',
  '.': 'period()',
  '\0': 'eof()',
};

export class Compiler {
  private scanner = new Scanner()
  tokens: Array<Token>

  compile(code: string) {
    const tokens = this.scanner.scan(code);
    const transforms = [];

    return { tokens, transforms };
  }
}
