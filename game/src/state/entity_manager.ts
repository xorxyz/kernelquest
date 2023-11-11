import { Agent, AgentType, Flag, Man, Scroll, Wall } from '../world/agent';
import { Area } from '../world/area';

export class EntityManager {
  hero: Agent;

  home: Area;

  private counter = 1;

  private agents = new Set<Agent>();

  private areas = new Set<Area>();
  
  reset() {
    this.agents = new Set();
    this.areas = new Set();
  }

  init() {
    this.hero = this.createAgent('wizard');
    this.home = this.createArea();
  }

  createAgent (type: AgentType) {
    let agent

    const id = this.incrementCounter();

    switch (type) {
      case 'scroll':
        agent = new Scroll(id)
        break;
      case 'flag':
        agent = new Flag(id)
        break;
      case 'man':
        agent = new Man(id)
        break;
      case 'wall':
        agent = new Wall(id)
        break;
      default:
        agent = new Agent(id, type);
        break;
    }
    
    this.agents.add(agent);

    return agent;
  }

  createArea() {
    const area = new Area(this.incrementCounter());
    this.areas.add(this.home);
    return area;
  }

  getAgent (id: number): Agent {
    const agent = [...this.agents].find(a => a.id === id);
    if (!agent) throw new Error(`There is no entity with id '${id}'.`);
    
    return agent;
  }

  private incrementCounter(): number {
    const next = this.counter;
    this.counter += 1;
    return next;
  }
}
