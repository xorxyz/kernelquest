export const ESC = '\u001B';
export const escStr = (str: string) => `${ESC}${str}`;

const reset = escStr('[0m');

export const style = {
  invert: escStr('[7m'),
  reset: escStr('[0m'),
  white: escStr('[37m'),
  dim: (str) => escStr('[2m') + str + reset,
  bg: {
    black: (str) => escStr('[40m') + str + reset,
    white: (str) => escStr('[47m') + str + reset,
    red: (str) => escStr('[41m') + str + reset,
    green: (str) => escStr('[42m') + str + reset,
    blue: (str) => escStr('[46m') + str + reset,
  },
  fg: {
    black: (str) => escStr('[30m') + str + reset,
    white: (str) => escStr('[37m') + str + reset,
  },
};

export const screen = {
  clear: escStr('[2J'),
};

export const line = {
  clearAfter: escStr('[0K'),
  clearBefore: escStr('[1L'),
  clear: escStr('[2K'),
  start: escStr('[G'),
};

export const cursor = {
  blink: escStr('[5;m'),
  eraseRight: escStr('[K'),
  moveLeft: escStr('[1D'),
  moveRight: escStr('[1C'),
  up: (n) => escStr(`[${n}A`),
  right: (n) => escStr(`[${n}C`),
  down: (n) => escStr(`[${n}B`),
  left: (n) => escStr(`[${n}D`),
  setXY: (x: number, y: number) => escStr(`[${y};${x}H`),
};

export const ansiRegex = ({ onlyFirst = false } = {}) => {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
  ].join('|');

  return new RegExp(pattern, onlyFirst ? undefined : 'g');
};

export const stripAnsi = (string) =>
  (typeof string === 'string' ? string.replace(ansiRegex(), '') : string);
