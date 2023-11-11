import { Vector } from "../shared/vector";
import { Flag, Man, Scroll, Wall } from "../world/agent";
import { Level, StateManager } from "./state_manager";


export const levelOne = new Level(function (this: StateManager) {
  this.entityManager.home.put(new Vector(2, 0), this.entityManager.hero);
  const flag = this.entityManager.createAgent('flag') as Flag;

  this.entityManager.home.put(new Vector(2, 2), flag);

  [[0,0], [1,0], [3,0], [4,0], [0,1], [0,2], [0,3], [4, 2], [0, 4], [1, 4], [2, 4], [3, 4], [4, 1], [4, 3], [4, 4]].forEach(([x, y]) => {
    const wall = this.entityManager.createAgent('wall') as Wall;
    this.entityManager.home.put(new Vector(x, y), wall);
  });

  this.shell.print(`You enter a small, mostly empty room.`);
  this.shell.print(`In the back, a fire gently roars, casting shadows against the stone walls.`);
  this.shell.print(`The flag you seek rests in the center of the room, flat on the floor.`);
  this.shell.print(`You remember why you are here: you need to get the flag, and leave.`);
  this.shell.print(``);
  this.shell.print(`At any time, say 'help' to know what you can do.`);
});

export const levelTwo = new Level(function (this: StateManager) {
  const flag = this.entityManager.createAgent('flag') as Flag;

  this.entityManager.home.put(new Vector(3, 2), flag);

  [[2, 0], [4,0], [2, 2], [4, 2], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3]].forEach(([x, y]) => {
    const wall = this.entityManager.createAgent('wall') as Wall;
    this.entityManager.home.put(new Vector(x, y), wall);
  });
  this.shell.print(`This level is not done yet.`);
});

export const levelThree = new Level(function (this: StateManager) {
  const scroll = this.entityManager.createAgent('scroll') as Scroll;
  const flag = this.entityManager.createAgent('flag') as Flag;
  const man = this.entityManager.createAgent('man') as Man;

  scroll.write('password123');

  this.entityManager.home.put(new Vector(0, 2), scroll);
  this.entityManager.home.put(new Vector(2, 1), man);
  this.entityManager.home.put(new Vector(3, 2), flag);

  [[2, 0], [4,0], [2, 2], [4, 2], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3]].forEach(([x, y]) => {
    const wall = this.entityManager.createAgent('wall') as Wall;
    this.entityManager.home.put(new Vector(x, y), wall);
  });
});
