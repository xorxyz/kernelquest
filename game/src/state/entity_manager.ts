import { Agent, AgentType } from '../world/agent';
import { Area } from '../shared/area';
import { Vector } from '../shared/vector';

export class EntityManager {
  readonly hero: Agent;

  readonly home: Area;

  private counter = 1;

  private agents = new Set<Agent>();

  private areas = new Set<Area>();

  constructor() {
    this.hero = this.createAgent('wizard');
    this.home = this.createArea();

    this.home.put(new Vector(0, 0), this.hero);
  }

  private incrementCounter(): number {
    const next = this.counter;
    this.counter += 1;
    return next;
  }

  createAgent (type: AgentType) {
    const agent = new Agent(this.incrementCounter(), type);
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
}
