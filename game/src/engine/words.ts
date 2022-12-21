import {
  Combinator, i, LiteralNumber, LiteralRef, LiteralString, Operator, Quotation,
} from '../interpreter';
import syscalls from '../interpreter/syscalls';

/** @category Words */
const goto = new Combinator(['goto'], ['number', 'number'], async ({ stack, syscall }) => {
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;

  syscall({
    name: 'goto',
    args: { x: x.value, y: y.value },
  });
});

/** @category Words */
const look = new Combinator(['look'], ['number', 'number'], async ({ stack, syscall }) => {
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;

  syscall({
    name: 'look',
    args: { x: x.value, y: y.value },
  });
});

/** @category Words */
const ls = new Combinator(['ls'], [], async ({ syscall }) => {
  syscall({ name: 'ls' });
});

/** @category Words */
const step = new Combinator(['step'], [], async ({ syscall }) => {
  syscall({ name: 'step' });
});

/** @category Words */
const backstep = new Combinator(['backstep'], [], async ({ syscall }) => {
  syscall({ name: 'backstep' });
});

/** @category Words */
const right = new Combinator(['right'], [], async ({ syscall }) => {
  syscall({ name: 'right' });
});

/** @category Words */
const left = new Combinator(['left'], [], async ({ syscall }) => {
  syscall({ name: 'left' });
});

/** @category Words */
const rm = new Combinator(['rm'], ['ref'], async ({ stack, syscall }) => {
  const ref = stack.pop() as LiteralRef;
  syscall({
    name: 'rm',
    args: { id: ref.value },
  });
});

const create = new Combinator(['create'], ['string'], async ({ stack, syscall }) => {
  const str = stack.pop() as LiteralString;
  syscall({
    name: 'create',
    args: { thingName: str.value },
  });
});

const spawn = new Combinator(['spawn'], ['string'], async ({ stack, syscall }) => {
  const str = stack.pop() as LiteralString;
  syscall({
    name: 'spawn',
    args: { agentName: str.value },
  });
});

const tell = new Operator(['tell'], ['ref', 'quotation'], async ({ stack, syscall }) => {
  const message = stack.pop() as Quotation;
  const agentId = stack.pop() as LiteralRef;
  syscall({
    name: 'tell',
    args: {
      agentId: agentId.value,
      message: message.toString().slice(1, -1),
    },
  });
});

const halt = new Operator(['halt'], [], async ({ syscall }) => {
  syscall({
    name: 'halt',
  });
});

const prop = new Operator(['prop'], ['ref', 'string'], async ({ stack, syscall }) => {
  const propName = stack.pop() as LiteralString;
  const ref = stack.pop() as LiteralRef;
  syscall({
    name: 'prop',
    args: {
      id: ref.value,
      propName: propName.value,
    },
  });
});

const point = new Operator(['point'], ['number', 'number'], async ({ stack, syscall }) => {
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;
  syscall({
    name: 'point',
    args: {
      x: x.value,
      y: y.value,
    },
  });
});

const me = new Operator(['me'], [], ({ syscall }) => {
  syscall({
    name: 'me',
  });
});

const define = new Operator(['define'], ['string', 'quotation'], ({ stack, syscall }) => {
  const program = stack.pop() as Quotation;
  const name = stack.pop() as LiteralString;

  syscall({
    name: 'define',
    args: {
      name: name.value,
      term: program.toString(),
    },
  });
});

export default {
  goto,
  look,
  ls,
  step,
  backstep,
  right,
  left,
  rm,
  spawn,
  create,
  tell,
  halt,
  prop,
  point,
  me,
  define,
};
