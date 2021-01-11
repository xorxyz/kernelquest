import { GameSystem } from '../../src/ecs';

const id = 'movement';

export default class StagingSystem extends GameSystem {
  constructor() {
    super(id, ['scene', 'backstage']);
  }

  update() {
    this.entities.forEach((entity) => {

    });
  }
}
