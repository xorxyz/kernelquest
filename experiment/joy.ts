/* eslint-disable no-restricted-syntax */
type JoyValue = number | string | boolean | JoyList | JoyFunction;

interface JoyList extends Array<JoyValue> {}

interface JoyFunction {
  params: number;
  body: JoyValue[];
}

type JoyEnvironment = Record<string, JoyValue>;

function evalJoy(program: JoyValue[], env: JoyEnvironment): JoyValue {
  const stack: JoyList = [];

  for (const token of program) {
    if (typeof token === 'number' || typeof token === 'string' || typeof token === 'boolean') {
      stack.push(token);
    } else if (Array.isArray(token)) {
      stack.push(token);
    } else if (typeof token === 'object' && 'params' in token && 'body' in token) {
      const args: JoyValue[] = [];
      for (let i = 0; i < token.params; i++) {
        args.push(stack.pop()!);
      }
      args.reverse();
      stack.push(...evalJoy(token.body, { ...env, ...zipParams(token.params, args) }));
    } else if (typeof token === 'string' && token in env) {
      stack.push(env[token]);
    } else if (typeof token === 'string' && token in primitives) {
      const result = primitives[token](stack);
      if (result !== undefined) {
        stack.push(result);
      }
    } else {
      throw new Error(`Unknown token: ${token}`);
    }
  }

  if (stack.length === 1) {
    return stack[0];
  }
  return stack;
}

function zipParams(n: number, args: JoyValue[]): JoyEnvironment {
  const result: JoyEnvironment = {};
  for (let i = 0; i < n; i++) {
    result[`$${i}`] = args[i];
  }
  return result;
}

interface PrimitiveFunctions {
  [key: string]: (stack: JoyList) => JoyValue | undefined;
}

const primitives: PrimitiveFunctions = {
  '+': (stack) => stack.pop()! + stack.pop()!,
  '-': (stack) => {
    const b = stack.pop()!;
    const a = stack.pop()!;
    return a - b;
  },
  '*': (stack) => stack.pop()! * stack.pop()!,
  '/': (stack) => {
    const b = stack.pop()!;
    const a = stack.pop()!;
    return a / b;
  },
  '.': (stack) => {
    const top = stack.pop();
    console.log(top);
    return top;
  },
  dup: (stack) => {
    const top = stack[stack.length - 1];
    stack.push(top);
  },
  drop: (stack) => stack.pop(),
  swap: (stack) => {
    const a = stack.pop()!;
    const b = stack.pop()!;
    stack.push(a);
    stack.push(b);
  },
  over: (stack) => {
    const a = stack.pop()!;
    const b = stack.pop()!;
    stack.push(b);
    stack.push(a);
    stack.push(b);
  },
};
