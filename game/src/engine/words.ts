import {
  Combinator, LiteralNumber, LiteralRef, LiteralString, Operator,
} from '../interpreter';

/** @category Words */
const goto = new Combinator(['goto'], ['number', 'number'], async ({ stack, queue }) => {
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;

  queue?.add({
    name: 'goto',
    args: { x: x.value, y: y.value },
  });
});

/** @category Words */
const look = new Combinator(['look'], ['number', 'number'], async ({ stack, queue }) => {
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;

  queue?.items.unshift({
    name: 'look',
    args: { x: x.value, y: y.value },
  });
});

/** @category Words */
const ls = new Combinator(['ls'], [], async ({ queue }) => {
  queue?.items.unshift({ name: 'ls' });
});

/** @category Words */
const right = new Combinator(['right'], [], async ({ queue }) => {
  queue?.items.unshift({ name: 'right' });
});

/** @category Words */
const left = new Combinator(['left'], [], async ({ queue }) => {
  queue?.items.unshift({ name: 'left' });
});

/** @category Words */
const rm = new Combinator(['rm'], ['ref'], async ({ stack, queue }) => {
  const ref = stack.pop() as LiteralRef;
  queue?.items.unshift({
    name: 'rm',
    args: { id: ref.value },
  });
});

const create = new Combinator(['create'], ['string'], async ({ stack, queue, agent }) => {
  const str = stack.pop() as LiteralString;
  const { x, y } = agent.cursorPosition;
  queue?.add({
    name: 'create',
    args: { thingName: str.value, x, y },
  });
});

const spawn = new Combinator(['spawn'], ['string'], async ({ stack, queue, agent }) => {
  const str = stack.pop() as LiteralString;
  const { x, y } = agent.cursorPosition;
  queue?.add({
    name: 'spawn',
    args: { agentName: str.value, x, y },
  });
});

const tell = new Operator(['tell'], ['ref', 'string'], async ({ stack, queue }) => {
  const message = stack.pop() as LiteralString;
  const agentId = stack.pop() as LiteralRef;
  queue?.add({
    name: 'tell',
    args: {
      agentId: agentId.value,
      message: message.value,
    },
  });
});

const halt = new Operator(['halt'], [], async ({ queue }) => {
  queue?.add({
    name: 'halt',
  });
});

const prop = new Operator(['prop'], ['ref', 'string'], async ({ stack, queue }) => {
  const propName = stack.pop() as LiteralString;
  const ref = stack.pop() as LiteralRef;
  queue?.add({
    name: 'prop',
    args: {
      id: ref.value,
      propName: propName.value,
    },
  });
});

const point = new Operator(['point'], ['number', 'number'], async ({ stack, queue }) => {
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;
  queue?.add({
    name: 'point',
    args: {
      x: x.value,
      y: y.value,
    },
  });
});

export default {
  goto, look, ls, right, left, rm, spawn, create, tell, halt, prop, point,
};
