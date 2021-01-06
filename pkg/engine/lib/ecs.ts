import * as uuid from 'uuid';
import * as joi from 'joi';

/* Components */

export abstract class Component {
  public readonly data: object = {}
  public readonly type: string

  private readonly schema: object

  constructor (type: string, schema: object) {
    this.type = type
    this.schema = schema
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

export abstract class GameSystem { 
  public readonly id: string
  public readonly componentTypes: Array<string>

  entities: Array<Entity> = []

  constructor (id: string, types: Array<string>) {
    this.id = id
    this.componentTypes = types
  }

  load (entities: Array<Entity>) {
    if (!this.componentTypes.length) return false

    this.entities = entities.filter((entity: Entity) => {
      const types = entity.components.map(c => c.type)
  
      return this.componentTypes.every(type => types.includes(type))
    })

    return true
  }

  abstract update (number): void
}

export type SystemComponentMap = Map<GameSystem, SystemComponents>
