import * as uuid from 'uuid';

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

export abstract class SingletonComponent extends Component {
  
}

/* Entities */

export class Entity {
  id: string
  components: Map<string, Component> = new Map()

  constructor(components: Array<Component>) {
    this.id = uuid.v4();

    components.forEach(component => {
      this.components.set(component.type, component)
    })
  }
}

export type EntityMap = Map<string, Entity>

/* Systems */

export type SystemComponents = Map<string, Array<Component>>
export type IPlayerCommand = {
  frame?: number,
  timestamp? :string
  line: string
}

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
      const types = Array.from(entity.components.values()).map(c => c.type)
  
      return this.componentTypes.every(type => types.includes(type))
    })

    return true
  }

  abstract update (frame: number, commands: Array<IPlayerCommand>): void
}

export type SystemComponentMap = Map<GameSystem, SystemComponents>
