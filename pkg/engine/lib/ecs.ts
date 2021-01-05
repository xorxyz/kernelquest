import uuid from 'uuid';
import { ObjectSchema } from 'joi';

/* Components */

export type ComponentType = string

export class Component {
  public readonly type: ComponentType
  public readonly schema: ObjectSchema
  public readonly data: object

  constructor (type: ComponentType, schema: ObjectSchema, data: object) {
    if (!schema.validate(data)) {
      throw new Error('data does not match schema')
    }

    this.type = type;
    this.schema = schema;
    this.data = data
  }
}

/* Entities */

export class Entity {
  id: string
  components: Array<Component>

  constructor(components: Array<Component>) {
    this.id = uuid.v4();
    this.components = components;
  }
}

export type EntityMap = Map<string, Entity>


/* Systems */

export type SystemComponents = Map<string, Array<Component>>
export type UpdateFn = (components: SystemComponents) => void

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

export type SystemComponentMap = Map<GameSystem, SystemComponents>
