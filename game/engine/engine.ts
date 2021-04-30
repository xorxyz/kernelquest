import Clock from '../../lib/clock';
import { World } from './world';
import { CLOCK_MS_DELAY } from './constants';

export interface EngineOptions {
  rate?: number
}

export class Engine {
  cycle: number = 0
  world: World = new World()
  private clock: Clock

  constructor(opts?: EngineOptions) {
    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);

    this.clock.on('tick', this.update.bind(this));
  }

  update() {
    this.cycle++;

    this.world.rooms.forEach((room) => {
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
