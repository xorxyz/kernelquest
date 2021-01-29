import { EntityType } from '.';
import { Entity } from '../../src/ecs';
import BackstageComponent from '../components/backstage';
import SceneComponent from '../components/stage';
import TransformComponent from '../components/transform';

export default createZone;

function createZone() {
  return new Entity(EntityType.Zone, [
    new BackstageComponent(),
    new SceneComponent(),
    new TransformComponent(),
  ]);
}
