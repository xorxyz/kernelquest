import { Stack } from 'xor4-lib';
import { Thing } from './thing';
import { Agent } from './agent';
import { Area } from './area';

/** @category World */
export type Memory = Array<Thing>

/** @category World */
export type DataStack = Stack<Thing>

/** @category World */
export class World {
  public areas: Array<Area>;

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
