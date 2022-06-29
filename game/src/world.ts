import { Stack, Vector } from 'xor4-lib';
import { Area } from './area';
import { Thing } from './thing';
import { Agent, IFacing } from './agent';

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

  constructor(areas: Array<Area>) {
    this.areas = [...areas];
  }

  find(agent: Agent): Area | null {
    return this.areas.find((area) => area.has(agent)) || null;
  }

  clear() {
    this.areas.forEach((area) => area.clear());
  }
}
