import { Agent } from '../world/agent';
import { Area } from '../shared/area';
import { Vector } from '../shared/vector';

export class EntityManager {
  readonly hero: Agent;

  readonly home: Area;

  private counter = 1;

  private agents = new Set<Agent>();

  private areas = new Set<Area>();

  constructor() {
    this.hero = new Agent(this.incrementCounter());
    this.home = new Area(this.incrementCounter());

    this.home.put(new Vector(0, 0), this.hero);

    this.agents.add(this.hero);
    this.areas.add(this.home);
  }

  private incrementCounter(): number {
    const next = this.counter;
    this.counter += 1;
    return next;
  }
}
