import { Vector } from '../../src/math';
import { Component } from '../../src/ecs';

export default class TransformComponent extends Component {
  constructor () {
    super('transform', { 
      position: Vector,
      velocity: Vector
    })
  }
}
