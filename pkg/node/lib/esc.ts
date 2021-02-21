export const ESC = '\u001B';
export const escStr = (str: string) => `${ESC}${str}`;

const reset = escStr('[0m');

export const style = {
  invert: escStr('[7m'),
  reset: escStr('[0m'),
  white: escStr('[37m'),
  dim: (str) => escStr('[2m') + str + reset,
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
