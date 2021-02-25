import { Matrix, Vector } from '../../../lib/math';
import { Stack } from '../../../lib/stack';
import { Agent } from '../agents/agents';
import { Look } from '../visuals/looks';
import { Cell } from '../world/cells';

export abstract class Word {
  name: string
}

export abstract class Thing extends Word {}

export type ThingStack = Stack<Thing>

export class VisibleThing extends Thing {
  position: Vector = new Vector()
  look: Look
}

export interface IEnvironment {
  agents: Set<Agent>
  stack: Stack<Thing>
  cells: Matrix<Cell>
}

export abstract class Literal extends Thing {
  value: boolean | number | string
  look = new Look('00', '00', '00')

  constructor(v) {
    super();
    this.value = v;
  }

  exec(stack: Stack<Thing>) {
    stack.push(this);

    return stack;
  }
}

export abstract class Operator extends Thing {
  readonly arity: number

  constructor(arity: number) {
    super();

    this.arity = arity;
  }

  abstract $exec(): void

  exec(stack: Stack<Thing>) {
    const operands = this.pullOperands(stack);

    if (operands.length !== this.arity) {
      return false;
    }

    this.$exec();

    return true;
  }

  pullOperands(stack: Stack<Thing>) {
    const items = stack.popN(this.arity);

    return items;
  }
}

export abstract class Quotation extends Thing {
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

  constructor(v: number) {
    super(v);

    const str = v.toString(16).padStart(2, '0');
    this.look = new Look(str, str, str);
  }

  use() {
    return true;
  }
}

export class BooleanLiteral extends Literal {
  name = 'bool'
  value: boolean
  look = new Look('00', '00', '00')

  constructor(b: boolean) {
    super(b);

    const str = b ? '01' : '00';
    this.look = new Look(str, str, str);
  }

  use() {
    return true;
  }
}
