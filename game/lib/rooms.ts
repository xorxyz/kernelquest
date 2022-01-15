import { Rectangle, Vector } from 'xor4-lib/math';
import { Hero, Agent } from '../engine/agents';
import { Door, Place } from '../engine/places';
import { Wizard, Bug } from './agents';
import { Book, Flag, Tree } from './things';

export const demoRoom = new Place(
  0,
  0,
  new Rectangle(new Vector(0, 0), new Vector(16, 10)),
  setupDemoLevel,
);

export function setupDemoLevel(this: Place) {
  const player = new Hero(new Wizard());
  const bug = new Agent(new Bug());
  const trees = [[5, 0], [1, 1], [3, 1], [4, 1], [0, 2], [1, 4]];
  const flag = new Flag();
  const house = new Place(9, 2, new Rectangle(new Vector(9, 2), new Vector(5, 4)));
  const door = new Door(
    house,
    house.position.clone()
      .addY(house.outerRectangle.size.y - 1)
      .addX(Math.floor(house.outerRectangle.size.x / 2)),
  );

  this.add(player, new Vector(4, 4));
  this.add(bug, new Vector(5, 4));
  this.build(house, [door]);

  trees.forEach(([x, y]) => this.cellAt(Vector.from({ x, y }))?.put(new Tree()));
  this.cellAt(Vector.from({ x: 4, y: 0 }))?.put(new Book());
  this.cellAt(Vector.from({ x: 14, y: 8 }))?.put(flag);
}
