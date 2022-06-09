import { Combinator, LiteralRef, LiteralString, Operator, Quotation } from 'xor4-interpreter';
import { agents, CreateAction, Spirit, Wind } from '../src';
import {
  CloneAction,
  EvalAction,
  ListAction, LookAction,
  MoveThingAction, PathfindingAction, RemoveAction, SaveAction, SearchAction, SpawnAction,
} from './actions';

/** @category Words */
const goto = new Combinator(['goto'], ['ref'], async (stack, queue) => {
  const ref = stack.pop() as LiteralRef;

  const action = new PathfindingAction(ref.vector);

  queue?.add(action);
});

/** @category Words */
const create = new Combinator(['create'], ['string'], async (stack, queue) => {
  const program = stack.pop() as LiteralString;
  const name = program.lexeme;

  const agentDict = {
    ...agents,
  };

  const TypeCtor = agentDict[name] || Wind;

  queue?.add(new CreateAction(new TypeCtor()));
});

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

/** @category Words */
const search = new Combinator(['search'], ['string'], async (stack, queue) => {
  const str = stack.pop() as LiteralString;
  queue?.items.unshift(new SearchAction(str.value));
});

/** @category Words */
const save = new Combinator(['save'], [], async (stack, queue) => {
  queue?.items.unshift(new SaveAction());
});

/** @category Words */
export const clone = new Operator(['clone'], ['ref'], (stack, queue) => {
  const ref = stack.pop() as LiteralRef;

  queue?.add(new CloneAction(ref));
});

/** @category Words */
export const define = new Operator(['define'], ['string', 'quotation'], (stack, queue, dict) => {
  const program = stack.pop() as Quotation;
  const name = stack.pop() as LiteralString;

  if (dict) {
    console.log(dict);
    dict[name.value] = program;
  } else {
    throw new Error('Dictionary is not accessible.');
  }
});

export default {
  goto, look, ls, mv, rm, spawn, search, save, clone, create, define,
};
