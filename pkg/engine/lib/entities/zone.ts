import { Entity } from '../../src/ecs';
import BackstageComponent from '../components/backstage';
import SceneComponent from '../components/scene';
import TransformComponent from '../components/transform';

export default createZone;

function createZone() {
  return new Entity([
    new BackstageComponent(),
    new SceneComponent(),
    new TransformComponent(),
  ]);
}
