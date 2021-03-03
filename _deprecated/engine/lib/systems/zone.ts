import { GameSystem } from '../../src/ecs';
import { ComponentType } from '../components';
import ActorComponent from '../components/actor';
import WorldComponent from '../components/world';

const {
  World, Actor, Stage, Backstage,
} = ComponentType;

/*
  About describing a player's position
  A player must always be somewhere.
  That somewhere is represented as a zone.

  A zone has an id, a scene and a backstage
  The backstage is where actors are placed before
  they can enter a scene, or where they go when they leave a scene.
  This system handles the movement of entities in, out and in between zones.

  Scenes contain data about the presence of and position of actors.
  Backstages contain data about the presence of actors.
  Actors contain instructions about where they need to go next.
*/

export default class ZoneSystem extends GameSystem {
  constructor() {
    super('zone', [World, Stage, Backstage, Actor]);
  }

  // eslint-disable-next-line class-methods-use-this
  update() {
    // TODO
  }
}
