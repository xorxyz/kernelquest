import {
  Combinator, LiteralNumber, LiteralRef, LiteralString, Operator, Quotation,
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

// /** @category Words */
// const create = new Combinator(['create'], ['string'], async ({stack, queue}) => {
//   const program = stack.pop() as LiteralString;

//   queue?.add({
//     name: 'create',
//     args: { name: program.lexeme },
//   });
// });

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
const rm = new Combinator(['rm'], ['number', 'number'], async ({ stack, queue }) => {
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;
  queue?.items.unshift({
    name: 'rm',
    args: { x: x.value, y: y.value },
  });
});

const create = new Combinator(['create'], ['any'], async ({ stack, queue, agent }) => {
  const str = stack.pop() as LiteralString;
  const { x, y } = agent.cursorPosition;
  queue?.add({
    name: 'create',
    args: { thingName: str.lexeme, x, y },
  });
});

const spawn = new Combinator(['spawn'], ['any'], async ({ stack, queue, agent }) => {
  const str = stack.pop() as LiteralString;
  const { x, y } = agent.cursorPosition;
  queue?.add({
    name: 'spawn',
    args: { agentName: str.lexeme, x, y },
  });
});

const tell = new Operator(['tell'], ['number', 'string'], async ({ stack, queue, agent }) => {
  const message = stack.pop() as LiteralString;
  const agentId = stack.pop() as LiteralNumber;
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
  goto, look, ls, rm, spawn, create, tell, halt, prop, point,
};
