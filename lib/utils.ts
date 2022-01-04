import { Vector } from './math';

export const debug = console.log.bind(console);

/* eslint-disable import/prefer-default-export */
export function coinFlip() {
  return Math.floor(Math.random() * 2) === 0
    ? 1
    : -1;
}

export function getRandomInt(min, max) {
  // eslint-disable-next-line no-param-reassign
  min = Math.ceil(min);
  // eslint-disable-next-line no-param-reassign
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomDirection() {
  const direction = new Vector();
  const vertical = coinFlip();

  if (vertical === 1) {
    direction.setY(coinFlip());
  } else {
    direction.setX(coinFlip());
  }

  return direction;
}

export function isNumeric(str: string) {
  // eslint-disable-next-line no-restricted-globals
  return !isNaN(str as any) && !isNaN(parseFloat(str));
}
