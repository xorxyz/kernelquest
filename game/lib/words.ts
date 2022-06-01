import { Combinator, LiteralRef } from 'xor4-interpreter';
import { Spirit } from '../src';
import { ListAction, LookAction, MoveThingAction, PathfindingAction, RemoveAction, SpawnAction } from './actions';

/** @category Words */
const goto = new Combinator(['goto'], ['ref'], async (stack, queue) => {
  const ref = stack.pop() as LiteralRef;

  const action = new PathfindingAction(ref.vector);

  queue?.add(action);
});

// /** @category Words */
// const create = new Combinator(['new'], ['quotation', 'quotation'], async (stack, queue) => {
//   const args = stack.pop() as Quotation;
//   const program = stack.pop() as Quotation;

//   queue?.add(new CreateAction(program, args));
// });

/** @category Words */
const look = new Combinator(['look'], ['ref'], async (stack, queue) => {
  const ref = stack.pop() as LiteralRef;

  queue?.items.unshift(new LookAction(ref));
});

/** @category Words */
const ls = new Combinator(['ls'], [], async (stack, queue) => {
  queue?.items.unshift(new ListAction());
});

/** @category Words */
const mv = new Combinator(['mv'], ['ref', 'ref'], async (stack, queue) => {
  const a = stack.pop() as LiteralRef;
  const b = stack.pop() as LiteralRef;
  queue?.items.unshift(new MoveThingAction(b, a));
});

/** @category Words */
const rm = new Combinator(['rm'], ['ref'], async (stack, queue) => {
  const ref = stack.pop() as LiteralRef;
  queue?.items.unshift(new RemoveAction(ref));
});

/** @category Words */
const spawn = new Combinator(['spawn'], [], async (stack, queue) => {
  queue?.items.unshift(new SpawnAction(new Spirit()));
});

export default {
  goto, look, ls, mv, rm, spawn,
};
