# entities

```
Entity<T>: The entity type of a given component

PlayerEntity
  EmojiComponent
    value: String
  TransformComponent
  CommandComponent
    value: String
    previousValue: String

NPCEntity
  EmojiComponent
  TransformComponent
  DialogueComponent

ItemEntity
  EmojiComponent
  TransformComponent
  WeightComponent

PortalEntity
  EmojiComponent
  TransformComponent

RoomEntity
  RoomComponent
    entities: Array<Entity<RoomComponent>>
    rows: Array<Array<Entity<RoomComponent>>>
    players: Array<PlayerEntity>
    items: Array<ItemEntity>
    npcs: Array<NPCEntity>
    portals: Array<PortalEntity>

ZoneEntity
  ZoneComponent
    entities: Array<Entity<ZoneComponent>>
    rows: Array<Array<RoomEntity>>
    rooms: Array<RoomEntity>

WorldEntity
  WorldComponent
    zones: Array<ZoneEntity>

```
