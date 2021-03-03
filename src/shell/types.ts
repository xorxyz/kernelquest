import { Stack } from '../../lib/stack';

export abstract class Word {
  name: string
}

export abstract class Literal extends Word {
  value: boolean | number | string

  constructor(v) {
    super();
    this.value = v;
  }

  exec(stack: Stack<Word>) {
    stack.push(this);

    return stack;
  }
}

export abstract class Operator extends Word {
  readonly arity: number

  constructor(arity: number) {
    super();

    this.arity = arity;
  }

  abstract $exec(): void

  exec(stack: Stack<Word>) {
    const operands = this.pullOperands(stack);

    if (operands.length !== this.arity) {
      return false;
    }

    this.$exec();

    return true;
  }

  pullOperands(stack: Stack<Word>) {
    const items = stack.popN(this.arity);

    return items;
  }
}

export abstract class Quotation extends Word {
  list: Array<Word>
}

export class CharLiteral extends Literal {
  name = 'char'
  value: string

  use() {
    return true;
  }
}

export class NumberLiteral extends Literal {
  name = 'int'
  value: number

  use() {
    return true;
  }
}

export class BooleanLiteral extends Literal {
  name = 'bool'
  value: boolean

  use() {
    return true;
  }
}

export class Program {
  quotation: Quotation

  run(stack: Stack<Word>): Word | null {
    return stack.pop() || null;
  }
}

export class Environment {}
