import { Stack } from "../../../lib/stack";
import { operatorTokens, Scanner, Token } from "./lexer";
import stdlib from "./stdlib";

export type StackFn = (stack: Stack<Factor>) => void;

export abstract class Factor {
  lexeme: string
  constructor (lexeme: string) {
    this.lexeme = lexeme
  }
  abstract validate(stack: Stack<Factor>)
  abstract execute(stack: Stack<Factor>)
  _validate (stack: Stack<Factor>) {
    this.validate(stack);
  }
  _execute (stack: Stack<Factor>) {
    this.execute(stack);
  }
}


export class Literal extends Factor {
  value: any

  constructor (lexeme: string, value?: any) {
    super(lexeme);

    this.value = value;
  }

  validate(stack: Stack<Factor>) {
    return true;
  }

  execute(stack: Stack<Factor>) {
    stack.push(this);
  }
}

export type Term = Array<Factor>;

export type List = Array<Literal>;

export type Dictionary = Record<string, Factor>

export class Word {
  name: string
  term: Term
}

export interface IProgram {
  tokens: Array<Token>
  term: Term
}

export class Compiler {
  private scanner = new Scanner()
  tokens: Array<Token>
  dict: Dictionary

  constructor (dict?: Dictionary) {
    this.dict = Object.assign({}, stdlib);
  }

  compile(code: string): IProgram {
    const tokens = this.scanner.scan(code);
    const term: Array<Factor> = tokens.reduce((arr: Array<Factor>, token: Token) => {
      if (!token.lexeme) return arr;

      if (typeof token.literal !== 'undefined') {
        if (operatorTokens.includes(token.lexeme)) {
          const factor = this.dict[token.lexeme];

          if (!factor) throw new Error('factor not found: ' + token.lexeme)
          arr.push(factor);
          return arr
        } else {
          const literal = new Literal(token.lexeme, token.literal);
          arr.push(literal);
          return arr
        }
      } else {
        const factor = this.dict[token.lexeme];
        if (!factor) throw new Error('factor not found: ' + token.lexeme)
        arr.push(factor);
        return arr
      }
    }, []);

    return { 
      tokens, 
      term
    };
  }
}
