import { Component } from '../../src/ecs';

export default class StaminaComponent extends Component {
  constructor() {
    super('stamina', {
      sp: Number,
    });
  }
}
