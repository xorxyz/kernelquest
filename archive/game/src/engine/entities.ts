import { Agent } from './agent';
import { AgentTypeDict, AgentTypeName } from './agents';
import { Area } from './area';
import { Thing } from './thing';
import { ThingTypeDict, ThingTypeName } from './things';
import { World } from './world';
import { Zone } from './zone';

export class EntityManager {
  public hero;

  // 160 reserved for cells
  private counter = 1 + 160;

  private worlds: Set<World> = new Set();
  private zones: Set<Zone> = new Set();
  private areas: Set<Area> = new Set();
  private agents: Set<Agent> = new Set();
  private things: Set<Thing> = new Set();

  get lastId() {
    return this.counter;
  }

  get agentList() {
    return [...this.agents];
  }

  get areaList() {
    return [...this.areas];
  }

  get entityList() {
    return [...this.worlds, ...this.zones, ...this.areas, ...this.agents, ...this.things];
  }

  setHero(hero: Agent) {
    this.hero = hero;
  }

  createWorld() {
    const world = new World(this.counter++, this);
    this.worlds.add(world);
    return world;
  }

  createZone() {
    const zone = new Zone(this.counter++, this);
    this.zones.add(zone);
    return zone;
  }

  createArea() {
    const area = new Area(this.counter++, this);
    this.areas.add(area);
    return area;
  }

  createAgent(agentType: AgentTypeName) {
    const AgentTypeCtor = AgentTypeDict[agentType];
    const agent = new Agent(this.counter++, new AgentTypeCtor());
    this.agents.add(agent);
    return agent;
  }

  createThing(thingType: ThingTypeName) {
    const BodyTypeCtor = ThingTypeDict[thingType];
    const thing = new Thing(this.counter++, new BodyTypeCtor());
    this.things.add(thing);
    return thing;
  }
}
