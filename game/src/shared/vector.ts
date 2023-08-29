export const Xs = [0, 1, 0, -1];

export const Ys = [-1, 0, 1, 0];

export interface IVector {
  x: number,
  y: number
}

/** 2d vector (xy) */
export class Vector {
  x: number;

  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get label(): string {
    return `[${this.x.toString(16).toUpperCase()} ${this.y.toString(16).toUpperCase()}]`;
  }

  /** return a new Vector from the give xy object */
  static from(obj: { x: number, y: number }): Vector {
    return new Vector(obj.x, obj.y);
  }

  toObject(): IVector {
    return {
      x: this.x,
      y: this.y,
    };
  }

  isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }

  /** return a new Vector with the same xy */
  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  setXY(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  setX(x: number): this {
    this.x = x;
    return this;
  }

  setY(y: number): this {
    this.y = y;
    return this;
  }

  copyX(v: Vector): this {
    this.x = v.x;
    return this;
  }

  copyY(v: Vector): this {
    this.y = v.y;
    return this;
  }

  /** set the same xy as a given vector */
  copy(v: Vector): this {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  addX(x: number): this {
    this.x += x;
    return this;
  }

  addY(y: number): this {
    this.y += y;
    return this;
  }

  addXY(x: number, y: number): this {
    this.x += x;
    this.y += y;
    return this;
  }

  add(v: Vector): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  subX(x: number): this {
    this.x -= x;
    return this;
  }

  subY(y: number): this {
    this.y -= y;
    return this;
  }

  sub(v: Vector): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /* returns true if both vectors have matching x and y values */
  equals(v: Vector): boolean {
    return this.x === v.x && this.y === v.y;
  }

  opposes(v: Vector): boolean {
    return (this.x !== 0 && v.x !== 0 && (Math.sign(this.x) !== Math.sign(v.x)))
      || (this.y !== 0 && v.y !== 0 && (Math.sign(this.y) !== Math.sign(v.y)));
  }

  absolute(): this {
    this.x = Math.sign(this.x);
    this.y = Math.sign(this.y);
    return this;
  }

  invert(): this {
    this.x *= -1;
    this.y *= -1;
    return this;
  }
}
