/* eslint-disable camelcase */
import { debug, Stack } from '../shared';
import {
  ExecuteArgs, Factor, Literal, Term,
} from './types';
import {
  LiteralHex,
  LiteralList,
  LiteralNumber, LiteralString, LiteralTruth, LiteralType, LiteralVector, Quotation, TypeNames,
} from './literals';
import { capitalize } from '../shared/text';

export class Operator extends Factor {
  signature: Array<string>;
  execute: (args: ExecuteArgs) => unknown;
  aliases: Array<string>;

  constructor(
    aliases: Array<string>,
    signature: Array<string>,
    execute: (args: ExecuteArgs) => unknown,
  ) {
    super(aliases[0]);
    this.signature = signature;
    this.execute = execute;
    this.aliases = aliases;
  }

  validate(stack: Stack<Factor>) {
    if (!this.signature.length) return;

    if (this.signature.length > stack.length) {
      debug(this.signature.length, stack.length);
      throw new Error(
        `${this.aliases[0]}: missing operand(s), expected [${this.signature.join(' ')}]`,
      );
    }

    const args = stack.slice(-this.signature.length);

    for (const arg of args) {
      const i = args.findIndex((a) => a === arg);
      const types = this.signature[i].split('|');
      if (types.includes('quotation')) {
        types.push('list', 'vector');
      }
      if (types.includes('list')) {
        types.push('vector');
      }
      if (types.includes('number')) {
        types.push('hex');
      }
      if (!(arg instanceof Literal)) {
        throw new Error(`${this.aliases[0]}: arg not instanceof Literal`);
      }
      if (!types.includes('any') && !types.includes(arg.type)) {
        throw new Error(`${this.aliases[0]}:`
          + 'signature doesn\'t match stack type. '
          + `expected: '${this.signature.join(', ')}' got: '${arg.type}' at arg ${i}`);
      }
    }
  }

  toString() {
    return this.lexeme;
  }

  dup() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}

export class UnknownOperator extends Operator {
  name: string;
}

export class CustomOperator extends Operator {
  name: string;

  constructor (name: string, signature: Array<string>, term: Term) {
    super([name], signature, (execArgs) => {
      this.validate(execArgs.stack);

      term.forEach(factor => {
        factor.execute(execArgs)
      });
    })

    this.name = name;
  }
}

export const sum = new Operator(['+', 'sum', 'add'], ['number', 'number'], ({ stack }) => {
  const b = stack.pop() as LiteralNumber;
  const a = stack.pop() as LiteralNumber;
  const result = a.value + b.value;

  stack.push(new LiteralNumber(result));
});

export const difference = new Operator(['-', 'minus'], ['number', 'number'], ({ stack }) => {
  const [b] = stack.popN(1);
  const [a] = stack.popN(1);
  const result = (a as LiteralNumber).value - (b as LiteralNumber).value;

  stack.push(new LiteralNumber(result));
});

export const product = new Operator(['*', 'mul'], ['number', 'number'], ({ stack }) => {
  const [b] = stack.popN(1);
  const [a] = stack.popN(1);
  const result = (a as LiteralNumber).value * (b as LiteralNumber).value;

  stack.push(new LiteralNumber(result));
});

export const division = new Operator(['/', 'quotient'], ['number', 'number'], ({ stack }) => {
  const [b] = stack.popN(1);
  const [a] = stack.popN(1);
  const result = (a as LiteralNumber).value / (b as LiteralNumber).value;

  stack.push(new LiteralNumber(result));
});

export const dup = new Operator(['dup'], ['any'], ({ stack }) => {
  const a = stack.pop() as Factor;
  const b = a.dup();

  stack.push(a);
  stack.push(b);
});

export const dupd = new Operator(['dupd'], ['any', 'any'], ({ stack }) => {
  const b = stack.pop() as Factor;
  const a = stack.pop() as Factor;

  const aCopy = a.dup();

  stack.push(a);
  stack.push(aCopy);
  stack.push(b);
});

export const swap = new Operator(['swap'], ['any', 'any'], ({ stack }) => {
  const a = stack.pop();
  const b = stack.pop();

  if (!a || !b) return;

  stack.push(a);
  stack.push(b);
});

export const swapd = new Operator(['swapd'], ['any', 'any', 'any'], ({ stack }) => {
  const a = stack.pop() as Factor;
  const b = stack.pop() as Factor;
  const c = stack.pop() as Factor;

  stack.push(b);
  stack.push(c);
  stack.push(a);
});

export const pop = new Operator(['pop'], ['any'], ({ stack }) => {
  stack.pop();
});

export const popd = new Operator(['popd'], ['any', 'any'], ({ stack }) => {
  const a = stack.pop() as Factor;
  stack.pop();
  stack.push(a);
});

export const cat = new Operator(['cat'], ['string', 'string'], ({ stack }) => {
  const b = stack.pop() as LiteralString;
  const a = stack.pop() as LiteralString;

  stack.push(new LiteralString(a.value + b.value));
});

export const clear = new Operator(['clear'], [], ({ stack, syscall }) => {
  stack.popN(stack.length);
  syscall({ name: 'clear' });
});

export const typeOf = new Operator(['typeof'], ['any'], ({ stack }) => {
  const a = stack.pop() as Factor;

  stack.push(new LiteralString(a.type));
});

export const equals = new Operator(['=='], ['any', 'any'], ({ stack }) => {
  const a = stack.pop() as Factor;
  const b = stack.pop() as Factor;

  if (a.type !== b.type) {
    return stack.push(new LiteralTruth(false));
  }

  if (a instanceof LiteralVector && b instanceof LiteralVector) {
    return stack.push(new LiteralTruth(a.vector.equals(b.vector)));
  }

  const result = new LiteralTruth(a.value === b.value);

  stack.push(result);
});

export const notEquals = new Operator(['!='], ['any', 'any'], ({ stack }) => {
  const a = stack.pop() as Factor;
  const b = stack.pop() as Factor;

  if (a.type !== b.type) {
    stack.push(new LiteralTruth(false));
    return;
  }

  if (a instanceof LiteralVector && b instanceof LiteralVector) {
    stack.push(new LiteralTruth(!a.vector.equals(b.vector)));
    return;
  }

  const result = new LiteralTruth(a.value !== b.value);

  stack.push(result);
});

export const choice = new Operator(['choice'], ['truth', 'any', 'any'], ({ stack }) => {
  const right = stack.pop() as Factor;
  const left = stack.pop() as Factor;
  const truth = stack.pop() as LiteralTruth;

  if (truth.value) {
    stack.push(left);
  } else {
    stack.push(right);
  }
});

const vector_add = new Operator(['vector_add'], ['vector', 'vector'], ({ stack }) => {
  const b = stack.pop() as LiteralVector;
  const a = stack.pop() as LiteralVector;

  const result = a.vector.clone().add(b.vector);

  stack.push(new LiteralVector(result));
});

const vector_sub = new Operator(['vector_sub'], ['vector', 'vector'], ({ stack }) => {
  const b = stack.pop() as LiteralVector;
  const a = stack.pop() as LiteralVector;

  const result = a.vector.clone().sub(b.vector);

  stack.push(new LiteralVector(result));
});

export const toHex = new Operator(['to_hex'], ['number'], ({ stack }) => {
  const n = stack.pop() as LiteralNumber;

  stack.push(new LiteralHex(`0x${n.value.toString(16)}`));
});

export const assert = new Operator(['assert'], ['string'], ({ stack, db, dict }) => {
  const name = stack.pop() as LiteralString;
  const typeList = [...db.predicates[name.value]].reverse();

  if (!typeList) {
    throw new Error(`assert: predicate '${name.value}' does not exist.`);
  }

  typeList.forEach((t, i) => {
    const f = stack.peekN(i);
    if (!f || f.type !== t.value) {
      throw new Error(`assert: type '${t.value}' is missing from the stack.`);
    }
  })

  const args = stack.popN(typeList.length).reverse();
  const term = [...args.filter((x): x is Factor => !!x), dict[name.value]];
  console.log('term: ', term)
  db.facts.push(term);
});


export const query = new Operator(['?'], ['quotation'], ({ stack, db }) => {
  const quotation = stack.pop() as Quotation;

  const f = quotation.value.pop();

  if (!f) {
    throw new Error('query (\'?\') : quotation is missing a factor');
  }

  const facts = db.facts
    .filter(fact => fact.slice(-1)[0].lexeme === f.lexeme)
    .map(fact => new Quotation(fact))
    .reverse();

  const results = new Quotation()

  facts.forEach(f => results.value.push(f));

  stack.push(results);
});

export const predicate = new Operator(['predicate'], ['string', 'list'], ({ stack, dict, db }) => {
  const typeList = stack.pop() as LiteralList<LiteralType>;
  const name = stack.pop() as LiteralString;
  
  if (typeList.value.length < 1) {
    throw new Error(`predicate: expected at least 1 type, got ${typeList.value.length}.`);
  }

  if (typeList.of !== 'type') {
    throw new Error(`predicate: expected list of types, got '${typeList.of}'.`);
  }

  if (dict[name.value]) {
    throw new Error(`predicate: the word '${name.value}' already exists in the active dictionary.`);
  }

  db.predicates[name.value] = [...typeList.value]

  dict[name.value] = new CustomOperator(name.value, typeList.value.map((t) => t.value), [name, assert]);
});

export const is_type = new Operator(['is_type'], ['any', 'type'], ({ stack }) => {
  const t = stack.pop() as LiteralType;
  const factor = stack.pop() as Factor;

  console.log(factor, t)

  stack.push(new LiteralTruth(factor.type === t.value))
});

export const to_type = new Operator(['to_type'], ['string'], ({ stack }) => {
  const s = stack.pop() as LiteralString;
  if (!TypeNames.includes(s.value)) {
    throw new Error(`to_type: '${s.value}' is not a valid type.`)
  }

  stack.push(new LiteralType(capitalize(s.value), s.value, ''))
});

export const createUnknownWord = (name: string) => new UnknownOperator([name], [], (execArgs) => {
  const word = execArgs.dict[name];
  if (word) {
    word.execute(execArgs);
  } else {
    throw new Error(`The word ${name} is not defined in the active dictionary.`);
  }
});

const operators = {};

[
  equals, notEquals,
  sum, difference, product, division,
  dup, dupd, pop, popd,
  swap, swapd, cat, clear, typeOf,
  choice,
  vector_add, vector_sub,
  toHex, 
  is_type, to_type,
  predicate, assert, query
].forEach((operator) => {
  operator.aliases.forEach((alias) => {
    operators[alias] = operator;
  });
});

export default operators;
