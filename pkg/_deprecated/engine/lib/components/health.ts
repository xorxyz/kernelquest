import { Component } from '../../src/ecs';

export default class HealthComponent extends Component {
  constructor() {
    super('health', {
      hp: Number,
    });
  }
}
