import { Component } from '../../src/ecs';

export default class ManaComponent extends Component {
  constructor() {
    super('mana', {
      mp: Number,
    });
  }
}
