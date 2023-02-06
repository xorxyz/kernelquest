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

  public graph: Graph<Zone> = new Graph();
  public zones: Set<Zone> = new Set();
  public activeZone: Zone;
  public worldMap: WorldMap;
  public worldMapCursor: Agent;

  private entities: EntityManager;

  constructor(id: number, entities: EntityManager) {
    this.id = id;
    this.entities = entities;

    this.activeZone = entities.createZone();
    this.zones.add(this.activeZone);

    this.worldMap = new WorldMap(0, entities, 32, 16);
    this.worldMapCursor = entities.createAgent('king');

    this.activeZone.position.setXY(1, 2);

    this.worldMap.put(this.activeZone.node, this.activeZone.position);
    this.worldMap.put(this.worldMapCursor, this.activeZone.position);
    this.graph.addNode(this.activeZone);
  }

  createZone(vector: Vector) {
    const existing = this.findZoneAt(vector);
    if (existing) throw new Error(`There is already a zone at ${vector.label}.`);

    const zone: Zone = this.entities.createZone();
    zone.position.copy(vector);
    this.zones.add(zone);

    this.graph.addNode(zone);
    this.worldMap.put(zone.node, vector);

    this.graph.addLine(this.activeZone, zone);

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
