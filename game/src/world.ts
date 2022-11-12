import { Stack, Vector } from 'xor4-lib';
import { Area } from './area';
import { Thing } from './thing';
import { Agent, IFacing } from './agent';
import { King } from '../lib/agents';
import words from '../lib/words';

/** @category World */
export type Memory = Array<Thing>

/** @category World */
export type DataStack = Stack<Thing>

export interface Position {
  area: Vector,
  cell: Vector,
  facing: IFacing
}

/** @category World */
export class World {
  public tick: number = 0;
  public areas: Array<Area>;
  public agents: Set<Agent> = new Set();
  public things: Set<Thing> = new Set();
  public origin = new Area(0, 0);
  public creator = new Agent(0, new King(), words);
  public hero: Agent;

  constructor(areas: Array<Area> = []) {
    this.areas = [this.origin, ...areas];
    this.agents.add(this.creator);
    this.origin.put(this.creator);
    this.hero = this.creator;
  }

  find(agent: Agent): Area | null {
    return this.areas.find((area) => area.has(agent)) || null;
  }

  clear() {
    this.areas.forEach((area) => area.clear());
  }
}
