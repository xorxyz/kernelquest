import { Component } from '../../lib/ecs';
import { Vector } from '../../lib/math';

export default class TeleportComponent extends Component {
  constructor () {
    super('teleport', {
      area: String,
      position: Vector
    })
  }
}
