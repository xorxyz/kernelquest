export class Vector {
  x: number
  y: number

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  static from(obj: { x: number, y: number }) {
    return new Vector(obj.x, obj.y);
  }

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

  equals(v: Vector) {
    return this.x === v.x && this.y === v.y;
  }

  opposes(v: Vector) {
    return (
      (this.x && v.x && Math.sign(this.x) !== Math.sign(v.x))
      || (this.y && v.y && Math.sign(this.y) !== Math.sign(v.y))
    );
  }
}

export class Rect {
  position: Vector
  size: Vector

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
