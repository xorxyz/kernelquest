// xor shell v0.1
// copyright (c) 2019, 2020, 2021 Jonathan Dupré <jonathan@diagonal.sh>

import { TokenType } from './scanner.js';

const literals = ['true', 'false', 'number', 'char', 'string'];
const types = {
  '[': 'lparen()',
  ']': 'rparen()',
  '+': 'add()',
  '.': 'period()',
  '\0': 'eof()',
};
export class Compiler {
  constructor(tokens) {
    this.tokens = tokens;
  }
  compile() {
    const words = ['begin'];
    let previous;
    this.tokens.forEach((token) => {
      if (previous && previous.type === TokenType.DOT &&
                token.type === TokenType.EOF) {
        return;
      }
      let word;
      if (literals.includes(token.type)) {
        word = `${token.type}(${JSON.stringify(token.literal)})`;
      } else if (token.type === 'identifier') {
        word = `${token.lexeme}()`;
      } else {
        word = `${types[token.type]}`;
      }
      if (!word) { throw new Error(`couldnt compile: ${JSON.stringify(token)}`); }
      words.push(word);
      previous = token;
    });
    return words.join(' . ');
  }
}
