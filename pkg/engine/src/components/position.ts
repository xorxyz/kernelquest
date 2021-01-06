import * as joi from 'joi';
import { Component } from '../../lib/ecs';

export default class PositionComponent extends Component {
  constructor () {
    super('position', { x: Number, y: Number })
  }
}
