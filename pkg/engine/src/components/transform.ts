import { Vector } from '../../lib/math';
import { Component } from '../../lib/ecs';

export default class TransformComponent extends Component {
  constructor () {
    super('transform', { 
      position: Vector,
      velocity: Vector
    })
  }
}
