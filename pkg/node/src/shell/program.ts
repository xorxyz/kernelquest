import { Stack } from '../../lib/stack';
import { Quotation, Word } from '../engine/things/ideas';

export class Program {
  quotation: Quotation

  run(stack: Stack<Word>): Word | null {
    return stack.pop() || null;
  }
}
