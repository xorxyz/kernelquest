

import { Stack } from '../../lib/stack';
import { MAX_X, MAX_Y, TokenType } from '../../lib/constants';
import { debug } from '../../lib/logging';
import { Vector } from '../../lib/math';
import { Transform } from './compiler';

type Name = string
type Dict<T> = Record<Name, T>
type DataStack = Stack<Thing>
type Memory = Array<Thing>


abstract class DataType {
  value: any
  abstract name: string
  get appearance () {
    return this.value
  }
}

export abstract class Thing {
  abstract name: string
  readonly type: DataType
  position: Vector = new Vector()
  velocity: Vector = new Vector()
}

interface IProgram {
  transforms: Array<Transform>
}

abstract class SimpleDataType extends DataType {}
abstract class TruthValue extends SimpleDataType {}
abstract class CompoundDataType extends DataType {}

class Yes extends TruthValue { name: 'yes' }
class No extends TruthValue { name: 'no' }
class Hex extends SimpleDataType { name: 'hex' }
class Char extends SimpleDataType { name: 'char' }
class Operator extends SimpleDataType { name: 'op' }
class Word extends SimpleDataType { name: 'word' }
class List extends CompoundDataType { name: 'list' }

abstract class Program extends Thing implements IProgram {
  type: List
  transforms: Array<Transform>
}

class Ref {
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

interface Token {
  type: TokenType
  lexeme: string
  literal?: object
  line: number
}


export class Execution {
  private level = 0
  private stacks: Array<any>
  private program: IProgram
  private dict: Dict<Program>

  constructor(program: IProgram) {
    this.program = program;
  }

  get stack() {
    return this.stacks[this.level];
  }

  set stack(s) {
    this.stacks[this.level] = s;
  }

  load(dict: Dict<Program>) {
    this.dict = dict;
  }

  start(stack: DataStack) {
    this.stacks = [stack];

    this.program.transforms.map((transform) =>
      transform.fn.call(this, this.stack, transform.token));

    debug(this.program);

    return this.stack.peek();
  }
}
