import { Agent } from '../world/agent';
import { Area } from '../shared/area';
import { Vector } from '../shared/vector';

export class EntityManager {
  readonly player: Agent;

  readonly home: Area;

  private counter = 0;

  private agents = new Set<Agent>();

  private areas = new Set<Area>();

  constructor() {
    this.player = new Agent(this.incrementCounter());
    this.home = new Area(this.incrementCounter());

    this.home.put(new Vector(0, 0), this.player.id);

    this.agents.add(this.player);
    this.areas.add(this.home);
  }

  private incrementCounter(): number {
    const next = this.counter;
    this.counter += 1;
    return next;
  }
}
