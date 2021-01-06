import * as joi from 'joi'
import { Component } from '../../lib/ecs';

export default class GraphicComponent extends Component {
  constructor () {
    super('graphic', { emoji: String })
  }
}
