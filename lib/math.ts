export const Xs = [0, 1, 0, -1];
export const Ys = [-1, 0, 1, 0];

/** 2d vector (xy) */
export class Vector {
  x: number;
  y: number;

  get label() {
    return `${this.x} ${this.y}`;
  }

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /** return a new Vector from the give xy object */
  static from(obj: { x: number, y: number }) {
    return new Vector(obj.x, obj.y);
  }

  isZero() {
    return this.x === 0 && this.y === 0;
  }

  /** return a new Vector with the same xy */
  clone() {
    return new Vector(this.x, this.y);
  }

  setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  setX(x: number) {
    this.x = x;
    return this;
  }

  setY(y: number) {
    this.y = y;
    return this;
  }

  copyX(v: Vector) {
    this.x = v.x;
    return this;
  }

  copyY(v: Vector) {
    this.y = v.y;
    return this;
  }

  /** set the same xy as a given vector */
  copy(v: Vector) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  addX(x: number) {
    this.x += x;
    return this;
  }

  addY(y: number) {
    this.y += y;
    return this;
  }

  addXY(x: number, y: number) {
    this.x += x;
    this.y += y;
    return this;
  }

  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  subX(x: number) {
    this.x -= x;
    return this;
  }

  subY(y: number) {
    this.y -= y;
    return this;
  }

  sub(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /* returns true if both vectors have matching x and y values */
  equals(v: Vector) {
    return this.x === v.x && this.y === v.y;
  }

  opposes(v: Vector) {
    return (
      (this.x && v.x && Math.sign(this.x) !== Math.sign(v.x))
      || (this.y && v.y && Math.sign(this.y) !== Math.sign(v.y))
    );
  }

  absolute() {
    this.x = Math.sign(this.x);
    this.y = Math.sign(this.y);
    return this;
  }

  invert() {
    this.x *= -1;
    this.y *= -1;
    return this;
  }
}

/** 2d vector with random xy value */
export class RandomVector extends Vector {
  constructor() {
    super();

    this.x = getRandomInt(0, 9 * 3);
    this.y = getRandomInt(0, 9);
  }
}

export class Rectangle {
  position: Vector;
  size: Vector;

  constructor(position: Vector, size: Vector) {
    this.position = position;
    this.size = size;
  }

  get top() { return this.position.y; }
  get right() { return this.position.x + this.size.x - 1; }
  get bottom() { return this.position.y + this.size.y - 1; }
  get left() { return this.position.x; }

  contains(v: Vector) {
    return (
      v.x >= this.left && v.x <= this.right
      && v.y >= this.top && v.y <= this.bottom
    );
  }
}

/** a list of list of a given type */
export type Matrix<T> = Array<Array<T>>

/** create an array of a given length */
export const ArrN = (n) => Array(n).fill(0);

export type a = () => boolean

/** creates a Matrix<T> out of a thunk */
export const matrixOf = (w: number, h: number, fn) =>
  ArrN(h).map((rows, y) =>
    ArrN(w).map((row, x) => fn(x, y)));

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

export function isNumeric(str: string) {
  // eslint-disable-next-line no-restricted-globals
  return !isNaN(str as any) && !isNaN(parseFloat(str));
}

export type TakeN<T> = (arr: Array<T>) => Array<Array<T>>

/** [ 1, 2, 3, 4 ] -> [[ 1, 2 ],[ 3, 4 ]] */
export const takeN = (n: number) => (a) => a.reduce((arr, x, i1) => {
  const i2 = i1 % n;
  if (i2 === 0) {
    arr.push([]);
  }

  arr[i2].push(x);

  return arr;
}, [[]]);

export abstract class Points {
  value: number = 10;
  cap: number = 10;

  increase(amount: number) {
    this.value = Math.min(this.value + amount, this.cap);
  }

  decrease(amount: number) {
    this.value = Math.max(this.value - amount, 0);
  }
}

export function getRandom(from: number, to: number) {
  const min = Math.ceil(from);
  const max = Math.floor(to);

  return Math.floor(Math.random() * (max - min + 1) + min);
}

export class Ring<T> {
  private current: T;
  private values: Array<T>;
  constructor(arr: Array<T>) {
    this.values = arr;
    // eslint-disable-next-line prefer-destructuring
    this.current = arr[0];
  }
  get value() {
    return this.current;
  }
  next() {
    const index = this.values.findIndex((x) => x === this.current);
    const y = this.values[index + 1];
    this.current = y === undefined
      ? this.values[0]
      : y;

    return this.current;
  }
}

export const forN = (n: number, fn) => new Array(n).fill(0).forEach(fn);
