import { coinFlip, Ring, Vector } from './math';

export class Heading extends Vector {}

export class North extends Heading {
  constructor() { super(0, -1); }
}

export class East extends Heading {
  constructor() { super(1, 0); }
}

export class South extends Heading {
  constructor() { super(0, 1); }
}

export class West extends Heading {
  constructor() { super(-1, 0); }
}

export type Directions = North | East | South | West

export const NORTH = new North();
export const EAST = new East();
export const SOUTH = new South();
export const WEST = new West();

export class Direction {
  private ring = new Ring([new North(), new East(), new South(), new West()]);

  constructor(direction: Directions) {
    while (!this.ring.value.equals(direction)) {
      this.ring.next();
    }
  }

  get value() {
    return this.ring.value;
  }

  rotate() {
    this.ring.next();
    return this;
  }

  rotateUntil(direction: North | East | South | West | Vector) {
    while (!this.ring.value.equals(direction)) {
      this.rotate();
    }
  }

  clone() {
    const c = new Direction(this.value);
    return c;
  }
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
