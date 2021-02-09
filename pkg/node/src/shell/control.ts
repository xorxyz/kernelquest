export const ESC = '\u001B';
export const escStr = (str: string) => `${ESC}${str}`;

export const line = {
  clear: escStr('[2K'),
  start: escStr('[G'),
};

export const cursor = {
  eraseRight: escStr('[K'),
  moveLeft: escStr('[1D'),
  moveRight: escStr('[1C'),
  up: (n) => escStr(`[${n}A`),
  right: (n) => escStr(`[${n}C`),
  down: (n) => escStr(`[${n}B`),
  left: (n) => escStr(`[${n}D`),
  setXY: (x: number, y: number) => escStr(`[${y};${x}H`),
};
