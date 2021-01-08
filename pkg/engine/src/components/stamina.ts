import { Component } from '../../lib/ecs';

export default class StaminaComponent extends Component {
  constructor () {
    super('stamina', {
      sp: Number,
    })
  }
}
