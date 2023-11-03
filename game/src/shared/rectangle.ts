import { Vector } from "./vector";

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