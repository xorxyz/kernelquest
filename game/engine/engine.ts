import { Agent } from './agents';
import { World } from './world';
import Clock from '../../lib/clock';
import { CLOCK_MS_DELAY } from './constants';
import { debug } from '../../lib/logging';

export interface EngineOptions {
  rate?: number
}

export class Engine {
  tick: number = 0
  world: World = new World()
  agents: Set<Agent> = new Set()
  private clock: Clock

  constructor(opts?: EngineOptions) {
    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);

    this.clock.on('tick', this.update.bind(this));
  }

  update() {
    this.tick++;
    this.agents.forEach((agent) => {
      agent.sp.increase(10);
      if (agent.sp.value > 0) {
        const action = agent.takeTurn(this.tick);
        if (!action) return;
        action.perform();
      }
    });
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }
}
