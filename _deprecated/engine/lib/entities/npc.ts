import { EntityType } from '.';
import { Entity } from '../../src/ecs';
import ActorComponent from '../components/actor';
import HealthComponent from '../components/health';
import TransformComponent from '../components/transform';
import VisualComponent from '../components/visual';

export default new Entity(EntityType.Npc, [
  new HealthComponent(),
  new ActorComponent(),
  new TransformComponent(),
  new VisualComponent(),
]);