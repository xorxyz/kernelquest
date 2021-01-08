import { Component } from '../../src/ecs';
import { Vector } from '../../src/math';

export default class TeleportComponent extends Component {
  constructor () {
    super('teleport', {
      area: String,
      position: Vector
    })
  }
}
