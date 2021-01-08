import { Component } from '../../src/ecs';

export default class ActorComponent extends Component {
  constructor () {
    super('actor', {
      type: String
    })
  }
}
