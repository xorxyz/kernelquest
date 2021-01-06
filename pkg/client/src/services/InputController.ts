import { EventEmitter } from 'events';
import { Vector } from '../../../engine/lib/math';

export default class InputController extends EventEmitter {
  constructor() {
    super();

    window.addEventListener('DOMContentLoaded', () => {
      window.addEventListener('keyup', this.handleKey.bind(this));
    });
  }

  onDestroy() {
    window.removeEventListener('keyup', this.handleKey.bind(this));
  }

  // eslint-disable-next-line class-methods-use-this
  handleKey(e) {
    e.preventDefault();

    switch (e.key) {
      case 'ArrowUp':
        this.emit('move', new Vector(0, -1));
        break;
      case 'ArrowRight':
        this.emit('move', new Vector(1, 0));
        break;
      case 'ArrowDown':
        this.emit('move', new Vector(0, 1));
        break;
      case 'ArrowLeft':
        this.emit('move', new Vector(-1, 0));
        break;
      default:
        break;
    }
  }
}
