import { Vector } from '../../../lib/geom';
import { WallItem } from '../things/items';

const arrayOf = (n, T) => new Array(n).fill(0).map(() => new T());

export const createWall = (length: number, v: Vector, direction: Vector) => {
  const cursor = v.clone();
  const walls = arrayOf(length, WallItem);

  walls.forEach((wall) => {
    wall.position.copy(cursor);
    cursor.add(direction);
  });

  return walls;
};

export const createHWall = (length: number, v: Vector) =>
  createWall(length, v, new Vector(1, 0));

export const createVWall = (length: number, v: Vector) =>
  createWall(length, v, new Vector(0, 1));
