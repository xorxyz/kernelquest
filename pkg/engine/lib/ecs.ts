import uuid from 'uuid';
import * as joi from 'joi';

/* Components */

export class Component {
  static type: string
  static schema: joi.ObjectSchema

  public readonly data: object

  constructor (data: object) {
    if (!Component.schema.validate(data)) {
      throw new Error('data does not match schema')
    }

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
  public readonly componentTypes: Array<string>
  public readonly update: UpdateFn

  constructor(id: string, types: Array<string>, update: UpdateFn) {
    this.id = id;
    this.componentTypes = types;
    this.update = update;
  }
}

export type SystemComponentMap = Map<GameSystem, SystemComponents>
