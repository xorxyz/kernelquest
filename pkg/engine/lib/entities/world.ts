import { Entity } from '../../src/ecs';
import WorldComponent from '../components/world';

export default function () {
  return new Entity([
    new WorldComponent(),
  ]);
}
