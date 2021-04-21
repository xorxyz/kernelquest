import { Vector } from '../../lib/math';
import { Look } from '../visuals/looks';

export abstract class Particle {
  position: Vector = new Vector()
  velocity: Vector = new Vector()
  look: Look

  spawn(x, y) {
    this.position.setXY(x, y);
  }

  move(v) {
    this.velocity.copy(v);
  }
}

export class Ball extends Particle {
  look = new Look('ball', '⚪', 'it\'s a ball')
}
