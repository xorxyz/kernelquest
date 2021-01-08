import { Component } from '../../lib/ecs';

export default class VisualComponent extends Component {
  constructor () {
    super('visual', { emoji: String })
  }
}
