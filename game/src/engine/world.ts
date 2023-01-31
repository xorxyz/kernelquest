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
  public areas: Set<Area> = new Set();
  public graph: Graph<Area> = new Graph();
  public node: Thing;
}

/** @category World */
export class World {
  public tick = 0;
  public areas: Array<Area>;
  public agents: Set<Agent> = new Set();
  public things: Set<Thing> = new Set();
  public creator: Agent;
  public hero: Agent;
  public origin: Area;
  public zones: Graph<Thing> = new Graph();
  public worldMap: WorldMap = new WorldMap(0, 0, 32, 16);
  public worldMapCursor: Agent;
  public activeZone: Thing;
  public activeArea: Area;

  // id 0 is null, 1-160 is for cells
  public counter = 1 + 160;

  constructor(areas: Array<Area>) {
    console.log('areas:', areas);
    this.areas = areas;
    this.origin = areas[0];
    this.creator = this.spawn('king', this.origin);
    this.hero = this.creator;
    this.activeArea = areas[0];

    this.create('tree', this.worldMap, new Vector(3, 6));
    this.create('tree', this.worldMap, new Vector(2, 6));
    this.create('tree', this.worldMap, new Vector(3, 7));
    const zone1 = this.create('zone', this.worldMap, new Vector(3, 4));
    this.create('route', this.worldMap, new Vector(4, 4));
    this.create('route', this.worldMap, new Vector(5, 4));
    this.create('route', this.worldMap, new Vector(6, 4));
    const zone2 = this.create('route', this.worldMap, new Vector(7, 4));
    this.create('route', this.worldMap, new Vector(7, 5));
    this.create('route', this.worldMap, new Vector(7, 6));
    this.create('route', this.worldMap, new Vector(7, 7));
    const zone3 = this.create('zone', this.worldMap, new Vector(7, 8));
    this.create('route', this.worldMap, new Vector(8, 4));
    this.create('route', this.worldMap, new Vector(9, 4));
    this.create('route', this.worldMap, new Vector(10, 4));
    const zone4 = this.create('zone', this.worldMap, new Vector(11, 4));
    this.create('route', this.worldMap, new Vector(8, 8));
    this.create('route', this.worldMap, new Vector(9, 8));
    this.create('route', this.worldMap, new Vector(10, 8));
    const zone5 = this.create('route', this.worldMap, new Vector(11, 8));
    this.create('route', this.worldMap, new Vector(11, 8));
    this.create('route', this.worldMap, new Vector(11, 9));
    this.create('route', this.worldMap, new Vector(11, 10));
    const zone6 = this.create('zone', this.worldMap, new Vector(11, 11));

    this.zones.addNode(zone1);
    this.zones.addNode(zone2);
    this.zones.addNode(zone3);
    this.zones.addNode(zone4);
    this.zones.addNode(zone5);
    this.zones.addNode(zone6);

    this.zones.addLine(zone1, zone2);
    this.zones.addLine(zone2, zone3);
    this.zones.addLine(zone2, zone4);
    this.zones.addLine(zone3, zone5);
    this.zones.addLine(zone5, zone6);

    this.activeZone = zone1;

    this.create('river', this.worldMap, new Vector(13, 0));
    this.create('river', this.worldMap, new Vector(13, 1));
    this.create('river', this.worldMap, new Vector(13, 2));
    this.create('river', this.worldMap, new Vector(13, 3));
    this.create('river', this.worldMap, new Vector(13, 4));
    this.create('river', this.worldMap, new Vector(13, 5));
    this.create('river', this.worldMap, new Vector(14, 6));
    this.create('river', this.worldMap, new Vector(14, 7));
    this.create('river', this.worldMap, new Vector(14, 8));
    this.create('river', this.worldMap, new Vector(14, 9));
    this.create('river', this.worldMap, new Vector(14, 10));
    this.create('river', this.worldMap, new Vector(14, 11));
    this.create('river', this.worldMap, new Vector(14, 12));
    this.create('river', this.worldMap, new Vector(14, 13));
    this.create('river', this.worldMap, new Vector(15, 14));
    this.create('river', this.worldMap, new Vector(15, 15));

    this.worldMap.cells[0].erase();
    this.worldMapCursor = this.spawn('king', this.worldMap, new Vector(3, 4));
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
}
