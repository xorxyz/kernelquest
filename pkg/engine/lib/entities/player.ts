import { Entity } from '../../src/ecs';
import CommandComponent from '../components/command';
import ActorComponent from '../components/actor';
import IntentComponent from '../components/intent';
import HealthComponent from '../components/health';
import TransformComponent from '../components/transform';
import VisualComponent from '../components/visual';
import ManaComponent from '../components/mana';
import StaminaComponent from '../components/stamina';
import { EntityType } from '.';

export default createPlayerEntity;

function createPlayerEntity(userId = '96a2c440-9415-47f7-871c-f41f631699a1') {
  const playerEntity = new Entity(EntityType.Player, [
    new CommandComponent(userId),
    new IntentComponent(),
    new ActorComponent(),
    new HealthComponent(),
    new ManaComponent(),
    new StaminaComponent(),
    new TransformComponent(),
    new VisualComponent(),
  ]);

  return playerEntity;
}
