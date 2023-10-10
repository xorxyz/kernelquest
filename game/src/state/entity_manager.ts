import { Agent, AgentType, Flag, Man, Scroll, Wall } from '../world/agent';
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

    const createLevelOne = () => {
      const scroll = this.createAgent('scroll') as Scroll;
      const flag = this.createAgent('flag') as Flag;
      const man = this.createAgent('man') as Man;

      scroll.write('password123');

      this.home.put(new Vector(0, 2), scroll);
      this.home.put(new Vector(2, 1), man);
      this.home.put(new Vector(3, 2), flag);

      [[2, 0], [4,0], [2, 2], [4, 2], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3]].forEach(([x, y]) => {
        const wall = this.createAgent('wall') as Wall;
        this.home.put(new Vector(x, y), wall);
      });
    }

    createLevelOne();
  }

  private incrementCounter(): number {
    const next = this.counter;
    this.counter += 1;
    return next;
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
}
