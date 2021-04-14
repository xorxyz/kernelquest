// eslint-disable-next-line import/no-unresolved
import { Token, TokenType } from './scanner.js';

const literals = ['true', 'false', 'number', 'char', 'string'];
const types = {
  '[': 'lparen()',
  ']': 'rparen()',
  '+': 'add()',
  '.': 'period()',
  '\0': 'eof()',
};

export class Compiler {
  tokens: Array<Token>

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  compile() {
    const words: Array<string> = ['begin'];
    let previous: Token;

    this.tokens.forEach((token) => {
      if (previous && previous.type === TokenType.DOT &&
          token.type === TokenType.EOF) { return; }

      let word: string;

      if (literals.includes(token.type)) {
        word = `${token.type}(${JSON.stringify(token.literal)})`;
      } else if (token.type === 'identifier') {
        word = `${token.lexeme}()`;
      } else {
        word = `${types[token.type]}`;
      }

      if (!word) throw new Error(`couldnt compile: ${JSON.stringify(token)}`);

      words.push(word);
      previous = token;
    });

    return words.join(' . ');
  }
}
