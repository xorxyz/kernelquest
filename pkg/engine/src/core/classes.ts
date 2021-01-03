import uuid from 'uuid';
import { ObjectSchema } from 'joi';
import { ComponentType, UpdateFn } from './types';

export class Component {
  public readonly schema: ObjectSchema
  public readonly data: object

  constructor (schema: ObjectSchema, data) {
    if (!schema.validate(data)) {
      throw new Error('data does not match schema')
    }

    this.schema = schema;
    this.data = {}
  }
}

export class Entity {
  id: string
  components: Array<Component>

  constructor(components: Array<Component>) {
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
