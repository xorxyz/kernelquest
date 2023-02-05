import { Stack, Vector } from '../shared';
import { WorldMap } from './area';
import { Thing } from './thing';
import { Agent, IFacing } from './agent';
import Graph from '../shared/graph';
import { Zone } from './zone';
import { EntityManager } from './engine';

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
  readonly id: number;
  readonly type = {
    name: 'world',
  };

  public graph: Graph<Thing> = new Graph();
  public worldMap: WorldMap;
  public worldMapCursor: Agent;
  public activeZone: Zone;
  public zones: Set<Zone> = new Set();

  private entities: EntityManager;

  constructor(id: number, entities: EntityManager) {
    this.id = id;
    this.entities = entities;

    const zone: Zone = entities.createZone();
    this.zones.add(zone);
    this.activeZone = zone;

    this.worldMap = new WorldMap(0, entities, 32, 16);
  }

  createZone(vector: Vector) {
    const existing = this.findZoneAt(vector);
    if (existing) throw new Error(`There is already a zone at ${vector.label}.`);

    const zone: Zone = this.entities.createZone();
    zone.position.copy(vector);
    this.zones.add(zone);
    return zone;
  }

  destroyZone(vector: Vector) {
    const zone = this.findZoneAt(vector);
    if (!zone) throw new Error(`There is no area at ${vector.label}.`);
    this.zones.delete(zone);
  }

  setActiveZone(vector: Vector) {
    const zone = this.findZoneAt(vector);
    if (!zone) throw new Error(`Zone ${vector.label} does not exist.`);
    this.activeZone = zone;
    zone.setActiveArea(new Vector());
  }

  findZoneAt(vector: Vector): Zone | undefined {
    return [...this.zones].find((zone) => zone.position.equals(vector));
  }
}
