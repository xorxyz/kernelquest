import { Combinator } from 'xor4-interpreter/combinators';
import { LiteralNumber, Quotation } from 'xor4-interpreter/literals';
import { Vector } from 'xor4-lib/math';
import { CreateAction, PathfindingAction } from './actions';

export const goto = new Combinator(['goto'], ['number', 'number'], async (stack, queue) => {
  console.log('goto!');
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;

  const action = new PathfindingAction(new Vector(x.value, y.value));

  console.log(action);

  queue?.add(action);
});

export const create = new Combinator(['new'], ['quotation', 'quotation'], async (stack, queue) => {
  const args = stack.pop() as Quotation;
  const program = stack.pop() as Quotation;

  queue?.add(new CreateAction(program, args));
});
