import { Vector } from './math';

export const ESC = '\u001B';
export const esc = (str: string) => `${ESC}${str}`;

export const RESET = '[0m';
export const reset = esc(RESET);

export const colors = {
  bg: {
    black: (str) => `[40m${str}`,
    white: (str) => `[47m${str}`,
    red: (str) => `[41m${str}`,
    green: (str) => `[42m${str}`,
    blue: (str) => `[46m${str}`,
  },
  fg: {
    black: (str) => `[30m${str}`,
    white: (str) => `[37m${str}`,
  },
};

export const style = {
  invert: '[7m',
  reset: '[0m',
  white: '[37m',
  dim: (str) => `[2m${str}`,
  in: (fg, bg, str) => esc(fg) + esc(bg) + str,
};

export const screen = {
  clear: '[2J',
};

export const line = {
  clearAfter: '[0K',
  clearBefore: '[1L',
  clear: '[2K',
  start: '[G',
};

export const cursor = {
  blink: '[5;m',
  eraseRight: '[K',
  moveLeft: '[1D',
  moveRight: '[1C',
  up: (n) => `[${n}A`,
  right: (n) => `[${n}C`,
  down: (n) => `[${n}B`,
  left: (n) => `[${n}D`,
  setXY: (x: number, y: number) => `[${y};${x}H`,
  set: (v: Vector) => `[${v.y};${v.x}H`,
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
