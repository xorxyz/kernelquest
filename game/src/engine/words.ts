/* eslint-disable camelcase */
import {
  Combinator, Factor, LiteralNumber, LiteralRef, LiteralString, LiteralVector, Operator, Quotation,
} from '../interpreter';
import {
  EAST,
  East, NORTH, North, SOUTH, South, Vector, WEST, West,
} from '../shared';

/** @category Words */
// const goto = new Combinator(['goto'], ['vector'], async ({ stack, syscall }) => {
//   const v = stack.pop() as LiteralVector;

//   syscall({
//     name: 'goto',
//     args: { x: v.vector.x, y: v.vector.y },
//   });
// });

/** @category Words */
const path = new Combinator(['path'], ['vector', 'vector'], async ({ stack, syscall }) => {
  const to = (stack.pop() as LiteralVector).vector;
  const from = (stack.pop() as LiteralVector).vector;

  syscall({
    name: 'path',
    args: {
      fromX: from.x,
      fromY: from.y,
      toX: to.x,
      toY: to.y,
    },
  });
});

/** @category Words */
const look = new Combinator(['look'], ['vector'], async ({ stack, syscall }) => {
  const v = (stack.pop() as LiteralVector).vector;

  syscall({
    name: 'look',
    args: { x: v.x, y: v.y },
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

const create = new Combinator(['create'], ['vector', 'string'], async ({ stack, syscall }) => {
  const str = stack.pop() as LiteralString;
  const v = (stack.pop() as LiteralVector).vector;
  syscall({
    name: 'create',
    args: {
      thingName: str.value,
      x: v.x,
      y: v.y,
    },
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

const that = new Operator(['that'], ['vector'], async ({ stack, syscall }) => {
  const v = (stack.pop() as LiteralVector).vector;
  syscall({
    name: 'that',
    args: {
      x: v.x,
      y: v.y,
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
  const items = [...stack.arr];
  stack.clear();
  stack.push(Quotation.from(items));
});

const face = new Operator(['face'], ['vector'], ({ stack, syscall }) => {
  const v = (stack.pop() as LiteralVector).vector;
  const headings = [SOUTH, WEST, NORTH, EAST];

  if (headings.every(heading => !v.equals(heading))) {
    throw new Error(`face: not a valid heading, got ${v.label}`);
  }

  syscall({
    name: 'face',
    args: v.toObject(),
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

const read = new Operator(['read'], [], ({ syscall }) => {
  syscall({
    name: 'read',
  });
});

const claim = new Operator(['claim'], ['vector', 'vector'], ({ stack, syscall }) => {
  const size = stack.pop() as LiteralVector;
  const position = stack.pop() as LiteralVector;

  syscall({
    name: 'claim',
    args: {
      x: position.vector.x,
      y: position.vector.y,
      w: size.vector.x,
      h: size.vector.y,
    },
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

const scratch = new Operator(['scratch'], ['number'], ({ stack, syscall }) => {
  const n = stack.pop() as LiteralNumber;
  syscall({
    name: 'scratch',
    args: {
      n: n.value,
    },
  });
});

const erase = new Operator(['erase'], [], ({ syscall }) => {
  syscall({
    name: 'erase',
  });
});

const rect = new Operator(['rect'], ['vector', 'vector'], ({ stack }) => {
  const v2 = (stack.pop() as LiteralVector).vector;
  const v1 = (stack.pop() as LiteralVector).vector;

  const w = v2.x - v1.x + 1;
  const h = v2.y - v1.y + 1;

  const t = new Array(w).fill(0).map((_, i) => new Vector(v1.x + i, v1.y));
  const r = new Array(h - 1).fill(0).map((_, i) => new Vector(v1.x + w - 1, v1.y + 1 + i));
  const b = new Array(w - 1).fill(0).map((_, i) => new Vector(v2.x - 1 - i, v2.y));
  const l = new Array(h - 2).fill(0).map((_, i) => new Vector(v2.x - w + 1, v2.y - 1 - i));

  const result = Quotation.from(t.concat(r, b, l).map((v) => new LiteralVector(v)));

  stack.push(result);
});

const wait = new Operator(['wait'], [], ({ syscall }) => {
  syscall({
    name: 'wait',
  });
});

const area = new Operator(['area'], ['vector'], ({ stack, syscall }) => {
  const position = (stack.pop() as LiteralVector).vector;
  syscall({
    name: 'area',
    args: {
      x: position.x,
      y: position.y,
    },
  });
});

const zone = new Operator(['zone'], ['vector'], ({ stack, syscall }) => {
  const position = (stack.pop() as LiteralVector).vector;
  syscall({
    name: 'zone',
    args: {
      x: position.x,
      y: position.y,
    },
  });
});

const world = new Operator(['world'], ['vector'], ({ stack, syscall }) => {
  const position = (stack.pop() as LiteralVector).vector;
  syscall({
    name: 'world',
    args: {
      x: position.x,
      y: position.y,
    },
  });
});

const exit = new Operator(['exit'], [], ({ stack, syscall }) => {
  syscall({
    name: 'exit',
    args: {
    },
  });
});

const zoneAt = new Operator(['zone_at'], ['vector'], async ({ stack, syscall }) => {
  const v = (stack.pop() as LiteralVector).vector;
  syscall({
    name: 'zone_at',
    args: {
      x: v.x,
      y: v.y,
    },
  });
});

const print = new Operator(['print'], ['any'], async ({ stack, syscall }) => {
  const f = stack.pop() as Factor;
  console.log(f)
  syscall({
    name: 'print',
    args: {
      text: f.type === 'quotation' || f.type === 'list'
        ? (f as Quotation).value.map(f => f.toString()).join('\n')
        : f.toString()
    },
  });
});

const globals = {
  movement: {
    step,
    backstep,
    right,
    left,
    path,
    face,
    exit,
    // goto,
  },
  query: {
    look,
    ls,
    prop,
    facing,
    that,
    xy,
    zone_at: zoneAt,
  },
  action: {
    halt,
    get,
    put,
    claim,
    wait,
  },
  dict: {
    define,
    del,
  },
  admin: {
    create,
    rm,
    area,
    zone,
    world,
  },
  io: {
    say,
    hi,
    puts,
    tell,
    read,
    scratch,
    erase,
    print
  },
  struct: {
    stack: stackFn,
    rect,
  },
  alias: {
    me,
    north,
    east,
    south,
    west,
  },
};

export default {
  ...globals.admin,
  ...globals.alias,
  ...globals.dict,
  ...globals.io,
  ...globals.struct,
  ...globals.movement,
  ...globals.query,
  ...globals.action,
};
