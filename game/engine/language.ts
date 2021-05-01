import { Stack } from '../../lib/stack';
import { Thing } from './things';
import { Memory } from './world';
import { Execution } from './agents';
import { MAX_X, MAX_Y, TokenType } from './constants';

export abstract class RuntimeError extends Error {}
export class MissingOperand extends RuntimeError {}
export class WrongInputType extends RuntimeError {}

export abstract class DataType {
  value: any
  abstract name: string
  get appearance () {
    return this.value
  }
}

export abstract class SimpleDataType extends DataType {}
export abstract class TruthValue extends SimpleDataType {}
export class Yes extends TruthValue { name: 'yes' }
export class No extends TruthValue { name: 'no' }
export class Hex extends SimpleDataType { name: 'hex' }
export class Char extends SimpleDataType { name: 'char' }
export class Operator extends SimpleDataType { name: 'op' }
export class Word extends SimpleDataType { name: 'word' }

export abstract class CompoundDataType extends DataType {}
export class List extends CompoundDataType { name: 'list' }

export class Ref {
  readonly address: number
  private memory: Memory

  get value() {
    return this.memory[this.address];
  }

  constructor(memory: Memory, x: number, y: number) {
    if (x < 0 || x > MAX_X || y < 0 || y > MAX_Y) {
      throw new Error(`ref out of bounds (${x},${y})`);
    }
    this.memory = memory;
    this.address = (y * MAX_X) + x;
  }
}

export interface Token {
  type: TokenType
  lexeme: string
  literal?: object
  line: number
}

export abstract class Transform {
  signature
  abstract fn(this: Execution, stack: Stack<Thing>): void
}

export abstract class Effect extends Transform {}
export interface IProgram {
  transforms: Array<Transform>
}

export class Scanner {
  scan(code: string): Array<Token> {
    return [];
  }
}

export class Compiler {
  private scanner = new Scanner()

  compile(code: string) {
    const tokens = this.scanner.scan(code);
    const transforms = [];
    return { tokens, transforms };
  }
}

export class Add extends Transform {
  fn(this: Execution) {
    const b = this.stack.pop();
    if (typeof b === 'undefined') throw new MissingOperand();
    if (typeof b !== 'number') throw new WrongInputType();

    const a = this.stack.pop();
    if (typeof a === 'undefined') throw new MissingOperand();
    if (typeof a !== 'number') throw new WrongInputType();

    const result = a + b;

    this.stack.push(result);
  }
}
