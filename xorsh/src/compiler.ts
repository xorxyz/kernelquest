import { Execution } from "./interpreter";
import { operatorTokens, Scanner, Token } from "./lexer";
import { operators } from "./stdlib";

export class Word {
  lexeme: string
  fn: Function

  constructor (lexeme: string, fn: Function) {
    this.lexeme = lexeme;
    this.fn = fn;
  }

  static from (dict: Dictionary, token: Token): Word | null {
    const word = dict[token.lexeme];

    if (!(word instanceof Word)) return null;

    return word;
  }
}

export class Literal extends Word {
  constructor (lexeme: string, value: any) {
    super(lexeme, function (this: Execution) {
      this.stack.push(value)
    })
  }
}

export type Dictionary = Record<string, Word>

export class Compiler {
  private scanner = new Scanner()
  tokens: Array<Token>
  dict: Dictionary

  constructor (dict?: Dictionary) {
    this.dict = Object.assign({}, dict)
  }

  compile(code: string) {
    const tokens = this.scanner.scan(code);
    const words: Array<Word> = tokens.reduce((arr: Array<Word>, token: Token) => {
      if (!token.lexeme) return arr;

      if (typeof token.literal !== 'undefined') {
        if (operatorTokens.includes(token.lexeme)) {
          const word = Word.from(operators, token);
          if (!word) throw new Error('word not found: ' + token.lexeme)
          arr.push(word);
          return arr
        } else {
          const literal = new Literal(token.lexeme, token.literal);
          arr.push(literal);
          return arr
        }
      } else {
        const word = Word.from(this.dict, token);
        if (!word) throw new Error('word not found: ' + token.lexeme)
        arr.push(word);
        return arr
      }
    }, []);

    return { 
      tokens, 
      words
    };
  }
}
