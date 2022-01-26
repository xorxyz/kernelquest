import { Interpreter } from 'xor4-interpreter';
import { Compiler } from 'xor4-interpreter/compiler';
import { Factor } from 'xor4-interpreter/types';
import { Stack } from 'xor4-lib/stack';
import { Goal } from './things';
import { goto } from '../lib/words';

export class Mind {
  public stack: Stack<Factor> = new Stack();
  public interpreter: Interpreter;
  public goals: Array<Goal> = [];

  constructor() {
    const compiler = new Compiler({
      goto,
    });

    this.interpreter = new Interpreter(compiler, this.stack);
  }
}
