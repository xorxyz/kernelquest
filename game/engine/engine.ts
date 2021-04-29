import Clock from '../../lib/clock';
import { Agent } from './agents';
import { World } from './world';
import { CLOCK_MS_DELAY } from './constants';

export interface EngineOptions {
  rate?: number
}

export class Engine {
  cycle: number = 0
  private world: World = new World()
  private agents: Set<Agent> = new Set()
  private clock: Clock

  constructor(opts?: EngineOptions) {
    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);

    this.clock.on('tick', this.update.bind(this));
  }

  addAgent(agent: Agent) {
    const room = this.world.defaultZone.rooms[0][0];
    if (room) room.add(agent);
    this.agents.add(agent);
  }

  removeAgent(agent: Agent) {
    const room = this.world.defaultZone.find(agent);
    if (room) room.remove(agent);
    this.agents.delete(agent);
  }

  update() {
    this.cycle++;

    this.agents.forEach((agent) => {
      agent.move();
  
      const action = agent.takeTurn(this.cycle);
  
      if (action.authorize(agent)) {
        action.perform();
      }

      agent.sp.increase(10);
    });
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }
}
