/* eslint-disable camelcase */
import {
  Combinator, Factor, i, LiteralNumber, LiteralRef, LiteralString, LiteralVector, Operator, Quotation,
} from '../interpreter';
import syscalls from '../interpreter/syscalls';
import {
  East, North, South, West,
} from '../shared';

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

const create = new Combinator(['create'], ['number', 'number', 'string'], async ({ stack, syscall }) => {
  const str = stack.pop() as LiteralString;
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;
  syscall({
    name: 'create',
    args: { thingName: str.value, x: x.value, y: y.value },
  });
});

const spawn = new Combinator(['spawn'], ['number', 'number', 'string'], async ({ stack, syscall }) => {
  const str = stack.pop() as LiteralString;
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;
  syscall({
    name: 'spawn',
    args: { agentName: str.value, x: x.value, y: y.value },
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

const that = new Operator(['that'], ['number', 'number'], async ({ stack, syscall }) => {
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;
  syscall({
    name: 'that',
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
      program: program.dequote(),
    },
  });
});

const xy = new Operator(['xy'], ['ref'], ({ stack, syscall }) => {
  const ref = stack.pop() as LiteralRef;
  syscall({
    name: 'xy',
    args: {
      refId: ref.value,
    },
  });
});

const stackFn = new Operator(['stack'], [], ({ stack }) => {
  const quotation = new Quotation();

  stack.popN(stack.length).forEach((f) => {
    quotation.add(f as Factor);
  });

  stack.push(quotation);
});

const face = new Operator(['face'], ['vector'], ({ stack, syscall }) => {
  const { x, y } = (stack.pop() as LiteralVector).vector;

  syscall({
    name: 'face',
    args: { x, y },
  });
});

const facing = new Operator(['facing'], [], ({ syscall }) => {
  syscall({
    name: 'facing',
  });
});

const get = new Operator(['get'], [], ({ syscall }) => {
  syscall({
    name: 'get',
  });
});

const put = new Operator(['put'], [], ({ syscall }) => {
  syscall({
    name: 'put',
  });
});

const del = new Operator(['del'], ['string'], ({ stack, syscall }) => {
  const word = stack.pop() as LiteralString;
  syscall({
    name: 'del',
    args: {
      word: word.value,
    },
  });
});

const puts = new Operator(['puts'], ['string'], ({ stack, syscall }) => {
  const str = stack.pop() as LiteralString;
  syscall({
    name: 'puts',
    args: {
      message: str.value,
    },
  });
});

const say = new Operator(['say'], ['string'], ({ stack, syscall }) => {
  const str = stack.pop() as LiteralString;
  syscall({
    name: 'puts',
    args: {
      message: str.value,
    },
  });
});

const hi = new Operator(['hi'], ['ref'], ({ stack, syscall }) => {
  const ref = stack.pop() as LiteralRef;
  syscall({
    name: 'hi',
    args: {
      agentId: ref.value,
    },
  });
});

const pick = new Operator(['pick'], ['ref', 'number'], ({ stack, syscall }) => {
  const choiceId = stack.pop() as LiteralNumber;
  const agentId = stack.pop() as LiteralRef;
  syscall({
    name: 'pick',
    args: {
      agentId: agentId.value,
      choiceId: choiceId.value,
    },
  });
});

const read = new Operator(['read'], [], ({ stack, syscall }) => {
  syscall({
    name: 'read',
  });
});

const claim = new Operator(['claim'], ['vector', 'vector'], ({ stack, exec }) => {
  const size = stack.pop() as LiteralVector;
  const position = stack.pop() as LiteralVector;

  exec([
    position.value[0],
    position.value[1],
    goto,
  ], () => {
    console.log('done!');
  });
});

const north = new Operator(['north'], [], ({ stack }) => {
  stack.push(new LiteralVector(new North()));
});

const east = new Operator(['east'], [], ({ stack }) => {
  stack.push(new LiteralVector(new East()));
});

const south = new Operator(['south'], [], ({ stack }) => {
  stack.push(new LiteralVector(new South()));
});

const west = new Operator(['west'], [], ({ stack }) => {
  stack.push(new LiteralVector(new West()));
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
  that,
  me,
  define,
  xy,
  stack: stackFn,
  face,
  facing,
  get,
  put,
  del,
  puts,
  say,
  hi,
  pick,
  read,
  claim,
  north,
  east,
  south,
  west,
};
