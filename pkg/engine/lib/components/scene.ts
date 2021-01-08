import { Component } from '../../lib/ecs';

export default class SceneComponent extends Component {
  constructor () {
    super('scene', {
      actors: Array
    })
  }
}
