import { Component } from '../../src/ecs';

export default class SceneComponent extends Component {
  constructor() {
    super('scene', {
      actors: Array,
    });
  }
}
