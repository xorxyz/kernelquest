import { Combinator, LiteralNumber, Quotation } from 'xor4-interpreter';
import { Vector } from 'xor4-lib/math';
import { CreateAction, LookAction, PathfindingAction } from './actions';

const goto = new Combinator(['goto'], ['number', 'number'], async (stack, queue) => {
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;

  const action = new PathfindingAction(new Vector(x.value, y.value));

  queue?.add(action);
});

const create = new Combinator(['new'], ['quotation', 'quotation'], async (stack, queue) => {
  const args = stack.pop() as Quotation;
  const program = stack.pop() as Quotation;

  queue?.add(new CreateAction(program, args));
});

const look = new Combinator(['look'], [], async (stack, queue) => {
  queue?.items.unshift(new LookAction());
});

export default {
  goto, create, look,
};
