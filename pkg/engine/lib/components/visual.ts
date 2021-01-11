import { Component } from '../../src/ecs';

export default class VisualComponent extends Component {
  constructor() {
    super('visual', { emoji: String });
  }
}
