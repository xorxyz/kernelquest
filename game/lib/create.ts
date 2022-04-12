import { Vector } from 'xor4-lib';
import { Agent, Door, Place, Thing } from '../src';
import { Bug, Sheep, Wizard } from './agents';
import { Book, Crown, Flag, Gold, Grass, Tree, Water } from './things';

/** @category Create */
export const create: Record<string, (this: Place, ...any) => any> = {
  flag(x, y) {
    const flag = new Thing(new Flag());
    this.flags.add(flag);
    this.put(flag, new Vector(x, y));
  },
  crown(x, y) {
    const crown = new Thing(new Crown());
    this.crowns.add(crown);
    this.put(crown, new Vector(x, y));
  },
  book(x, y) {
    this.put(new Thing(new Book()), new Vector(x, y));
  },
  gold(x, y) {
    this.put(new Thing(new Gold()), new Vector(x, y));
  },
  sheep(x, y) {
    const sheep = new Agent(new Sheep());
    this.put(sheep, new Vector(x, y));
  },
  house(x, y, w, h) {
    const house = new Place(x, y, w, h);
    const doors = [1].map(() => new Thing(new Door()));
    this.build(house, doors);
  },
  wizard(x, y) {
    const hero = new Agent(new Wizard());
    this.put(hero, new Vector(x, y));
    return hero;
  },
  bug(x, y) {
    this.put(new Agent(new Bug()), new Vector(x, y));
  },
  trees(coordinates: Array<[number, number]>) {
    return coordinates.forEach(([x, y]) =>
      this.cellAt(Vector.from({ x, y }))?.put(new Thing(new Tree())));
  },
  grass(coordinates: Array<[number, number]>) {
    return coordinates.forEach(([x, y]) =>
      this.cellAt(Vector.from({ x, y }))?.put(new Thing(new Grass())));
  },
  water(coordinates: Array<[number, number]>) {
    return coordinates.forEach(([x, y]) =>
      this.cellAt(Vector.from({ x, y }))?.put(new Thing(new Water())));
  },
};
