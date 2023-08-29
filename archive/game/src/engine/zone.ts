import { Vector } from '../shared';
import Graph from '../shared/graph';
import { Area } from './area';
import { EntityManager } from './entities';
import { Thing } from './thing';

export class Zone {
  readonly id: number;
  readonly type = {
    name: 'zone',
  };
  public position = new Vector();

  public areas: Set<Area> = new Set();
  public graph: Graph<Area> = new Graph();
  public node: Thing;
  public activeArea: Area;

  private entities: EntityManager;

  constructor(id: number, entities: EntityManager) {
    this.id = id;
    this.entities = entities;
    this.node = entities.createThing('zone');
    this.activeArea = entities.createArea();

    this.areas.add(this.activeArea);
    this.node.position = this.position;
  }

  createArea(vector: Vector) {
    const existing = this.findAreaAt(vector);
    if (existing) throw new Error(`There is already an area at ${vector.label}.`);

    const area: Area = this.entities.createArea();
    area.position.copy(vector);
    this.areas.add(area);
    return area;
  }

  destroyArea(vector: Vector) {
    const area = this.findAreaAt(vector);
    if (!area) throw new Error(`There is no area at ${vector.label}.`);
    this.areas.delete(area);
  }

  setActiveArea(vector: Vector) {
    const area = this.findAreaAt(vector);
    if (!area) throw new Error(`Area ${vector.label} does not exist.`);
    this.activeArea.remove(this.entities.hero);
    this.activeArea = area;
    area.put(this.entities.hero);
  }

  findAreaAt(vector: Vector): Area | undefined {
    return [...this.areas].find((area) => area.position.equals(vector));
  }
}
