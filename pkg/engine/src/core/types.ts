import { GameSystem } from './classes';
import { IComponent } from './interfaces';

export enum JSType {
  'String',
  'Number',
  'Boolean'
}

export type ComponentType = string
export type ComponentDataSchema = Record<string, JSType>
export type ComponentMap = Map<ComponentType, Array<IComponent>>
export type UpdateFn = (components: ComponentMap) => void
export type SystemComponentMap = Map<GameSystem, Map<string, Array<IComponent>>>
