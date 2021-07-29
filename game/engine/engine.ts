import Clock from '../../lib/clock';
import { World } from './world';
import { CLOCK_MS_DELAY } from './constants';

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
    this.world = opts?.world || new World()

    this.clock.on('tick', this.update.bind(this));
  }

  update() {
    this.cycle++;

    this.world.rooms.forEach((room) => {
      room.cells.forEach(cell => {
        cell.update(this.cycle);
      });

      room.agents.forEach((agent) => {
        const action = agent.takeTurn(this.cycle);
    
        if (action && action.authorize(agent)) {
          action.perform(agent, room);
        }

        room.move(agent);
        agent.sp.increase(10);
      })
    });
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }
}
