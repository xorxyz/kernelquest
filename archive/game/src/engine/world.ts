import { Stack, Vector } from '../shared';
import { Area, WorldMap } from './area';
import { Thing } from './thing';
import { Agent, IFacing } from './agent';
import Graph from '../shared/graph';
import { Zone } from './zone';
import { EntityManager } from './entities';
import { Cell } from './cell';

/** @category World */
export type Memory = Array<Thing>

/** @category World */
export type DataStack = Stack<Thing>

export class LocationAddress {
  readonly n: number;
  readonly hex: string;

  readonly worldId: number;

  readonly zonePosition: Vector;
  readonly areaPosition: Vector;
  readonly cellPosition: Vector;

  constructor(n: number) {
    this.n = n;
    this.hex = n.toString(16);

    this.worldId = Number(this.hex.slice(0, 2));
    this.zonePosition = new Vector(Number(this.hex.slice(2, 3)), Number(this.hex.slice(3, 4)));
    this.areaPosition = new Vector(Number(this.hex.slice(4, 5)), Number(this.hex.slice(5, 6)));
    this.cellPosition = new Vector(Number(this.hex.slice(6, 7)), Number(this.hex.slice(7, 8)));
  }
}

export interface Position {
  area: Vector,
  cell: Vector,
  facing: IFacing
}

export interface ZonePort {
  zone: Zone
  area: Area
  cell: Cell
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
    this.worldMap.move(this.worldMapCursor, zone.position);
  }

  findZoneAt(vector: Vector): Zone | undefined {
    return [...this.zones].find((zone) => zone.position.equals(vector));
  }

  findEntityById(id: number) {
    return this.entities.entityList.find((e) => e.id === id);
  }

  findZoneWithArea(area: Area) {
    return [...this.zones].find((z) => z.areas.has(area));
  }

  findCellByAddress(addr: LocationAddress): Cell | null {
    const zone = this.findZoneAt(addr.zonePosition);
    if (!zone) return null;

    const area = zone.findAreaAt(addr.areaPosition);
    if (!area) return null;

    const cell = area.cellAt(addr.cellPosition);
    if (!cell) return null;

    return cell;
  }
}
