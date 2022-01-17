import { Vector } from 'xor4-lib/math';
import { Hero, Agent } from '../engine/agents';
import { Door, Place } from '../engine/places';
import { Wizard, Bug, Sheep } from './agents';
import { Book, Flag, Grass, Tree } from './things';

export const demoRoom = new Place(0, 0, 16, 10, function (this: Place) {
  const player = new Hero(new Wizard());
  const bug = new Agent(new Bug());
  const trees = [[5, 0], [1, 1], [3, 1], [4, 1], [0, 2], [1, 4]];
  const flag = new Flag();
  const house = new Place(9, 2, 5, 4);
  const door = new Door(house, house.getSouth());

  const house2 = new Place(2, 6, 3, 3);
  const sheep = new Agent(new Sheep());

  this.add(sheep, new Vector(15, 5));
  this.cellAt(new Vector(15, 4))?.put(new Grass());
  this.cellAt(new Vector(11, 0))?.put(new Grass());
  this.cellAt(new Vector(5, 9))?.put(new Grass());
  this.cellAt(new Vector(3, 2))?.put(new Grass());

  this.build(house2, [new Door(house2, house2.getEast())]);

  this.add(player, new Vector(4, 4));
  this.add(bug, new Vector(5, 4));
  this.build(house, [door]);

  trees.forEach(([x, y]) => this.cellAt(Vector.from({ x, y }))?.put(new Tree()));
  this.cellAt(Vector.from({ x: 4, y: 0 }))?.put(new Book());
  this.cellAt(Vector.from({ x: 14, y: 8 }))?.put(flag);

  const exitLocation = new Vector(8, 9);
  const exit = new Door(this, exitLocation);

  this.cellAt(exitLocation)?.put(exit);
});
