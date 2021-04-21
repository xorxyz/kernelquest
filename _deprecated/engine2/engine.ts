import { Agent } from './agents';
import { World } from './vm';

export class Engine {
  world: World = new World()
  agents: Set<Agent> = new Set()
  update() {
    this.agents.forEach((agent) => {
      agent.sp.increase(10);
      if (agent.sp.value > 0) {
        const action = agent.takeTurn();
        action.perform();
      }
    });
  }
}
