import { Component } from '../../lib/ecs';

export default class ActorComponent extends Component {
  constructor () {
    super('actor', {
      type: String
    })
  }
}
