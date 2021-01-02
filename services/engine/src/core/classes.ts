import uuid from 'uuid';
import { IComponent } from './interfaces';
import { ComponentType, UpdateFn } from './types';

export class Entity {
  id: string
  components: Array<IComponent>

  constructor(components: Array<IComponent>) {
    this.id = uuid.v4();
    this.components = components;
  }
}

export class EntityManager {
  entities: Record<string, Entity> = {}
}

export class GameSystem {
  public readonly id: string
  public readonly componentTypes: Array<ComponentType>
  public readonly update: UpdateFn

  constructor(id: string, types: Array<ComponentType>, update: UpdateFn) {
    this.id = id;
    this.componentTypes = types;
    this.update = update;
  }
}
