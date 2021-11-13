import Clock from '../../lib/clock';
import { World } from './world';
import { CLOCK_MS_DELAY } from './constants';
import { Vector } from '../../lib/math';
import { Book, Flag, Tree, Wall } from './things';

export interface EngineOptions {
  world?: World
  rate?: number
}

export class Engine {
  cycle: number = 0
  world: World
  private clock: Clock

  constructor(opts?: EngineOptions) {
    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.world = opts?.world || new World();

    const trees = [
      [5,0],
      [1,1],
      [3,1],
      [4,1],
      [0,2],
      [1,4],
    ]
    
    trees.forEach(([x,y]) => {
      this.world.rooms[0]
        .cellAt(Vector.from({ x, y }))
        .items.push(new Tree())
    })

    this.world.rooms[0]
      .cellAt(Vector.from({ x: 4, y: 0 }))
      .items.push(new Book())

    this.world.rooms[0]
      .cellAt(Vector.from({ x: 14, y: 8 }))
      .items.push(new Flag())

    this.clock.on('tick', this.update.bind(this));
  }

  update() {
    this.cycle++;

    this.world.rooms.forEach((room) => {
      room.cells.forEach(cell => {
        cell.update(this.cycle);
        cell.owner = null;
      });

      room.agents.forEach((agent) => {
        const action = agent.takeTurn(this.cycle);
    
        if (action && action.authorize(agent)) {
          action.perform(room, agent);
        } else {
          agent.sp.increase(1);
        }

        const cell = room.cellAt(agent.position.clone().add(agent.direction));
        if (cell) {
          cell.owner = agent;
        }
      })
    });
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }
}
