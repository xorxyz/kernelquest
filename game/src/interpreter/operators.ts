/* eslint-disable camelcase */
import { debug, Stack } from '../shared';
import {
  ExecuteArgs, Factor, Literal, Term,
} from './types';
import {
  LiteralHex,
  LiteralList,
  LiteralNumber, LiteralString, LiteralTruth, LiteralType, LiteralVector, Quotation, recursiveMap, TypeNames, Variable,
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

export const assert = new Operator(['assert'], ['quotation'], ({ stack, db, dict }) => {
  let quotation = stack.pop() as Quotation;

  quotation.value = recursiveMap(quotation.value, ((factor) => {
    if (factor instanceof UnknownOperator) {
      const knownOperator = dict[factor.lexeme];
      debug('knownOperator', knownOperator);
      if (knownOperator) return knownOperator;
    }
    return factor;
  }));

  db.assert(quotation.value);

  // syscall({
  //   name: 'print',
  //   args: {
  //     text: `Added assertion to database: ${quotation.toString()}`
  //   }
  // })
});

export const query = new Operator(['query'], [], ({ stack, db }) => {
  const factor = stack.pop();
  debug('query: factor', factor);
  if (!factor) {
    throw new Error('query: missing a predicate.')
  }
  const predicate = db.predicates.get(factor.lexeme);
  if (!predicate) {
    throw new Error(`query: predicate '${factor.lexeme}' is not defined.`)
  }
  debug('query:', predicate);
  const args = stack.popN(predicate.signature.length).reverse();
  const assertions = db.search([...args, factor]);
  const result = new Quotation(assertions.map(assertion => new Quotation(assertion.term)));

  stack.push(result);
});

export class Predicate extends Operator {
  name: string;

  constructor (name: string, signature: Array<string>) {
    super([name], signature.map(type => `${type}|variable`), (execArgs) => {
      this.validate(execArgs.stack);

      execArgs.stack.push(this);
      query.execute(execArgs);
    })

    this.name = name;
  }
}

export const and_query = new Operator(['and'], ['quotation'], ({ stack, db }) => {
  const quotation = stack.pop() as Quotation;

  stack.push(quotation);
});

export const predicate = new Operator(['predicate'], ['string', 'list'], ({ stack, dict, db, syscall }) => {
  const typeList = stack.pop() as LiteralList<LiteralType>;
  const name = stack.pop() as LiteralString;

  if (dict[name.value]) {
    throw new Error(`predicate: The word ${name.value} is already in the dictionary.`);
  }

  const predicate = new Predicate(name.value, typeList.value.map(t => t.value));
  const success = db.addPredicate(predicate);

  if (!success) {
    throw new Error(`predicate: Predicate '${name.value}' already exists.`);
  }

  dict[name.value] = predicate;
  syscall({
    name: 'print',
    args: {
      text: `Defined predicate '${name.value}' with types [${typeList.value.map(t => t.value).join(' ')}]`
    }
  })
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

export const length = new Operator(['length'], ['list|quotation'], ({ stack }) => {
  const quotation = stack.pop() as Quotation;

  stack.push(new LiteralNumber(quotation.value.length));
});

export const first = new Operator(['first'], ['list|quotation'], ({ stack }) => {
  const quotation = stack.pop() as Quotation;
  const value = quotation.value[0]

  if (value) stack.push(value);
});

export const second = new Operator(['second'], ['list|quotation'], ({ stack }) => {
  const quotation = stack.pop() as Quotation;
  const value = quotation.value[1]

  if (value) stack.push(value);
});

export const third = new Operator(['third'], ['list|quotation'], ({ stack }) => {
  const quotation = stack.pop() as Quotation;
  const value = quotation.value[2]

  if (value) stack.push(value);
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
  predicate, assert, query, 
  length, first, second, third, and_query
].forEach((operator) => {
  operator.aliases.forEach((alias) => {
    operators[alias] = operator;
  });
});

export default operators;
