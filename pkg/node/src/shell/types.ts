import { Stack } from '../../lib/stack';

export abstract class Word {}

export type DataStack = Stack<Word>

export abstract class Literal extends Word {
  private value: any

  constructor(value: any) {
    super();

    this.value = value;
  }

  exec(stack: DataStack) {
    stack.push(this.value);

    return stack;
  }
}

export class StringLiteral extends Literal {}

export class NumberLiteral extends Literal {}

export class BooleanLiteral extends Literal {}

export abstract class Operator extends Word {
  readonly arity: number

  constructor(arity: number) {
    super();

    this.arity = arity;
  }

  abstract $exec(): void

  exec(stack: DataStack) {
    const operands = this.pullOperands(stack);

    if (operands.length !== this.arity) {
      return false;
    }

    this.$exec();

    return true;
  }

  pullOperands(stack: DataStack) {
    const items: Array<any> = [];

    stack.list.slice(0, this.arity).forEach(() => {
      if (!stack.length) return;

      const item = stack.pop();
      items.push(item);
    });

    return items;
  }
}

export abstract class Quotation extends Word {
  list: Array<Word>

  constructor(list) {
    super();
    this.list = list;
  }
}
