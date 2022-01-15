import { Direction, DirectionName, Rectangle, Vector } from 'xor4-lib/math';
import { Hero, Agent } from '../engine/agents';
import { Room } from '../engine/room';
import { Door, Structure } from '../engine/structures';
import { Wizard, Bug } from './agents';
import { Book, Flag, Tree } from './things';

export const demoRoom = new Room(0, 0, setupDemoLevel);

export function setupDemoLevel(this: Room) {
  const player = new Hero(new Wizard());
  const bug = new Agent(new Bug());
  const trees = [[5, 0], [1, 1], [3, 1], [4, 1], [0, 2], [1, 4]];
  const flag = new Flag();
  const struct = new Structure(player, new Rectangle(new Vector(9, 2), new Vector(5, 4)));
  const door = new Door(struct, new Direction(DirectionName.south));

  this.add(player, new Vector(4, 4));
  this.add(bug, new Vector(5, 4));
  this.build(struct, [door]);

  trees.forEach(([x, y]) => this.cellAt(Vector.from({ x, y }))?.put(new Tree()));
  this.cellAt(Vector.from({ x: 4, y: 0 }))?.put(new Book());
  this.cellAt(Vector.from({ x: 14, y: 8 }))?.put(flag);
}
