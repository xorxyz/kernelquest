import { Stack } from '../../lib/stack';

type Literal = number;
type Operator = Function;
type Quotation = Array<Literal | Operator>;

type DataStack = Stack<Literal | Operator | Quotation>

export default class Interpreter {
  private stack: DataStack

  eval(expr: string): Array<string> {
    console.log('eval():', expr);

    const words = expr.split(' ').filter((x) => x !== ' ');
    const outputs: Array<string> = [];

    console.log('words:', words);

    words.forEach((word, i) => {
      console.log('word:', i, word);
      switch (word) {
        case '':
          break;
        case 'ping':
          outputs.push('pong.');
          break;
        default:
          outputs.push('command unknown.');
          break;
      }
    });

    return outputs;
  }
}
