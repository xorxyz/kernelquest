import { Component } from '../../lib/ecs';

export default class ManaComponent extends Component {
  constructor () {
    super('mana', {
      mp: Number,
    })
  }
}
