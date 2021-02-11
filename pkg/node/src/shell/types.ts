/*
 * the shell language types
 */
import { Stack } from './stack';

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
    const items = stack.popN(this.arity);

    return items;
  }
}

export abstract class Quotation extends Word {
  list: Array<Word>

  constructor(list: Array<Word>) {
    super();
    this.list = list;
  }
}
