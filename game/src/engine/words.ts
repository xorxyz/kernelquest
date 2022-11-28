import {
  Combinator, LiteralRef, LiteralString, Operator, Quotation,
} from '../interpreter';

/** @category Words */
const goto = new Combinator(['goto'], ['ref'], async ({ stack, queue }) => {
  const ref = stack.pop() as LiteralRef;

  queue?.add({
    name: 'goto',
    args: { x: ref.vector.x, y: ref.vector.y },
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
const look = new Combinator(['look'], ['ref'], async ({ stack, queue }) => {
  const ref = stack.pop() as LiteralRef;

  queue?.items.unshift({
    name: 'look',
    args: { x: ref.vector.x, y: ref.vector.y },
  });
});

/** @category Words */
const ls = new Combinator(['ls'], [], async ({ queue }) => {
  queue?.items.unshift({ name: 'ls' });
});

/** @category Words */
const mv = new Combinator(['mv'], ['ref', 'ref'], async ({ stack, queue }) => {
  const a = stack.pop() as LiteralRef;
  const b = stack.pop() as LiteralRef;
  queue?.items.unshift({
    name: 'mv',
    args: {
      fromX: b.vector.x,
      fromY: b.vector.y,
      toX: a.vector.x,
      toY: a.vector.y,
    },
  });
});

/** @category Words */
const rm = new Combinator(['rm'], ['ref'], async ({ stack, queue }) => {
  const ref = stack.pop() as LiteralRef;
  queue?.items.unshift({
    name: 'rm',
    args: { x: ref.vector.x, y: ref.vector.y },
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

// /** @category Words */
// const search = new Combinator(['search'], ['string'], async ({stack, queue}) => {
//   const str = stack.pop() as LiteralString;
//   queue?.items.unshift(new SearchAction(str.value));
// });

// /** @category Words */
// const save = new Combinator(['save'], [], async ({stack, queue}) => {
//   queue?.items.unshift(new SaveAction());
// });

// /** @category Words */
// export const clone = new Operator(['clone'], ['ref'], (stack, queue) => {
//   const ref = stack.pop() as LiteralRef;

//   queue?.add(new CloneAction(ref));
// });

// /** @category Words */
// eslint-disable-next-line max-len
// export const define = new Operator(['define'], ['string', 'quotation'], ({ stack, queue, dict }) => {
//   const program = stack.pop() as Quotation;
//   const name = stack.pop() as LiteralString;

//   if (dict) {
//     console.log(dict);
//     dict[name.value] = program;
//   } else {
//     throw new Error('Dictionary is not accessible.');
//   }
// });

export default {
  goto, look, ls, mv, rm, spawn, create,
};
