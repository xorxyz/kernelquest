import { EntityType } from '.';
import { Entity } from '../../src/ecs';
import TeleportComponent from '../components/teleport';
import TransformComponent from '../components/transform';
import VisualComponent from '../components/visual';

export default new Entity(EntityType.Teleporter, [
  new TransformComponent(),
  new VisualComponent(),
  new TeleportComponent(),
]);
