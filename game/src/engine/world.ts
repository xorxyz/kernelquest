import { Stack, Vector } from '../shared';
import { Area, WorldMap } from './area';
import { BodyType, Thing } from './thing';
import { Agent, AgentType, IFacing } from './agent';
import {
  Ancestor,
  Bat,
  Bug, Child, Deer, Demon, Dragon,
  Earth, Elf, Fairy, Fire, Ghost, Goblin, King, Man,
  Ogre, Owl, Rat, Sheep, Snail, Snake, Spider, Spirit, Stars, Water, Wind, Wizard, Wolf,
} from './agents';
import {
  Axe,
  Bag,
  Bomb,
  Book,
  Boot,
  Bow,
  Candle, Castle, Crown, Door, Flag, Fruit, Grass,
  Key, Map, Mountain, River, Route, Shield, Skull, Tree, Village, Wall, ZoneNode,
} from './things';
import words from './words';
import Graph from '../shared/graph';

/** @category World */
export type Memory = Array<Thing>

/** @category World */
export type DataStack = Stack<Thing>

export interface Position {
  area: Vector,
  cell: Vector,
  facing: IFacing
}

const agentTypeNames = [
  'king', 'dragon',
  'stars',
  'wind', 'water', 'earth', 'fire',
  'fairy', 'elf', 'wizard', 'sheep', 'bug', 'man', 'spirit',
  'owl', 'deer', 'snail',
  'child', 'ancestor', 'demon',
  'snake', 'goblin', 'ogre', 'spider', 'wolf', 'ghost', 'rat', 'bat',
] as const;

const thingTypeNames = [
  'tree', 'wall', 'door', 'flag', 'crown', 'key', 'shield', 'skull', 'book', 'grass',
  'mountain', 'fruit', 'castle', 'village', 'candle', 'axe', 'bomb', 'bow', 'bag',
  'boot', 'bag', 'map', 'route', 'zone',
];

export type AgentTypeName = typeof agentTypeNames[number]
export type ThingTypeName = typeof thingTypeNames[number]

export const AgentTypeDict: Record<AgentTypeName, new () => AgentType> = {
  king: King,
  dragon: Dragon,
  stars: Stars,
  wind: Wind,
  water: Water,
  earth: Earth,
  fire: Fire,
  fairy: Fairy,
  elf: Elf,
  wizard: Wizard,
  sheep: Sheep,
  bug: Bug,
  man: Man,
  spirit: Spirit,
  owl: Owl,
  deer: Deer,
  snail: Snail,
  child: Child,
  ancestor: Ancestor,
  demon: Demon,
  snake: Snake,
  goblin: Goblin,
  ogre: Ogre,
  spider: Spider,
  wolf: Wolf,
  ghost: Ghost,
  rat: Rat,
  bat: Bat,
};

export const ThingTypeDict: Record<ThingTypeName, new () => BodyType> = {
  tree: Tree,
  wall: Wall,
  door: Door,
  flag: Flag,
  crown: Crown,
  key: Key,
  shield: Shield,
  skull: Skull,
  book: Book,
  grass: Grass,
  river: River,
  mountain: Mountain,
  fruit: Fruit,
  castle: Castle,
  village: Village,
  candle: Candle,
  axe: Axe,
  bomb: Bomb,
  bow: Bow,
  bat: Bat,
  boot: Boot,
  bag: Bag,
  map: Map,
  route: Route,
  zone: ZoneNode,
};

export class Zone {
  public id: number;
  public areas: Set<Area> = new Set();
  public graph: Graph<Area> = new Graph();
  public node: Thing;

  createArea(vector: Vector) {
    const area = new Area(vector.x, vector.y);
    this.areas.add(area);
    return area;
  }
}

/** @category World */
export class World {
  public id = 0;
  public tick = 0;
  public areas: Array<Area>;
  public agents: Set<Agent> = new Set();
  public things: Set<Thing> = new Set();
  public creator: Agent;
  public graph: Graph<Thing> = new Graph();
  public worldMap: WorldMap = new WorldMap(0, 0, 32, 16);
  public worldMapCursor: Agent;
  public activeZone: Zone;
  public activeArea: Area;
  public zones: Set<Zone> = new Set();

  // id 0 is null, 1-160 is for cells
  public counter = 1 + 160;

  constructor(areas: Array<Area>) {
    const zone0 = new Zone();
    const area0 = new Area(0, 0);

    this.zones = new Set();

    this.areas = [area0];

    this.zones.add(zone0);

    this.activeZone = zone0;
    this.activeArea = area0;
  }

  spawn(agentType: AgentTypeName, area: Area, position?: Vector) {
    const AgentTypeCtor = AgentTypeDict[agentType];
    const agent = new Agent(this.counter++, new AgentTypeCtor(), words);
    this.agents.add(agent);
    area.put(agent, position);
    return agent;
  }

  create(bodyType: ThingTypeName, area: Area, position?: Vector) {
    const BodyTypeCtor = ThingTypeDict[bodyType];
    const thing = new Thing(this.counter++, new BodyTypeCtor());
    this.things.add(thing);
    area.put(thing, position);
    return thing;
  }

  find(agent: Agent): Area | null {
    return this.areas.find((area) => area.has(agent)) || null;
  }

  clear() {
    this.areas.forEach((area) => area.clear());
  }

  createZone(vector: Vector) {
    const zone = new Zone();
    this.zones.add(zone);
    return zone;
  }
}
