import { Token } from './scanner';

const literals = ['true', 'false', 'number', 'char', 'string'];
const types = {
  '[': 'lparen()',
  ']': 'rparen()',
  '+': 'add()',
  '\0': 'bye',
};

export class Compiler {
  tokens: Array<Token>

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  compile() {
    const words: Array<string> = ['hi'];

    this.tokens.forEach((token) => {
      let word;

      if (literals.includes(token.type)) {
        word = `${token.type}(${token.literal})`;
      } else if (token.type === 'identifier') {
        word = `${token.lexeme}()`;
      } else {
        word = `${types[token.type]}`;
      }

      if (!word) {
        throw new Error(`couldnt compile: ${JSON.stringify(token)}`);
      }

      words.push(word);
    });

    return words.join(' . ');
  }
}
