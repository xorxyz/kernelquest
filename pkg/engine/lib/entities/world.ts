import { EntityType } from '.';
import { Entity } from '../../src/ecs';
import WorldComponent from '../components/world';

export default function () {
  return new Entity(EntityType.World, [
    new WorldComponent(),
  ]);
}
