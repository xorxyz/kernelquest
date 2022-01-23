import { Combinator } from 'xor4-interpreter/combinators';
import { LiteralNumber } from 'xor4-interpreter/literals';
import { Vector } from 'xor4-lib/math';
import { PathfindingAction } from './actions';

export const goto = new Combinator(['goto'], ['number', 'number'], async (stack, queue) => {
  console.log('goto!');
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;

  const action = new PathfindingAction(new Vector(x.value, y.value));

  console.log(action);

  queue?.add(action);
});
