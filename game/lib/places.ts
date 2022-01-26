import { Vector } from 'xor4-lib/math';
import { Agent } from '../engine/agents';
import { Place } from '../engine/places';
import { Door, Thing } from '../engine/things';
import { Wizard, Bug, Sheep } from './agents';
import { Book, Crown, Flag, Gold, Grass, Tree } from './things';

const create: Record<string, (this: Place, ...any) => any> = {
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
};

export const demoRoom = new Place(0, 0, 16, 10, function (this: Place) {
  create.wizard.call(this, 4, 4);

  create.trees.call(this, [[5, 0], [1, 1], [3, 1], [4, 1], [0, 2], [1, 4]]);
  create.grass.call(this, [[15, 4], [11, 0], [5, 9], [3, 2]]);

  const entities: Array<[string, Array<any>]> = [
    // ['bug', [5, 4]],
    // ['sheep', [15, 5]],
    // ['house', [9, 2, 5, 4]],
    // ['house', [2, 6, 3, 3]],
    ['flag', [14, 8]],
    // ['book', [4, 0]],
    // ['gold', [11, 8]],
    ['crown', [11, 9]],
  ];

  entities.forEach(([entity, args]) => create[entity].call(this, ...args));
});
