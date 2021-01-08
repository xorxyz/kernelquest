import { EventEmitter } from 'events';

/* Translate user input into command and arguments */

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
        this.emit('move', 'north');
        break;
      case 'ArrowRight':
        this.emit('move', 'east');
        break;
      case 'ArrowDown':
        this.emit('move', 'south');
        break;
      case 'ArrowLeft':
        this.emit('move', 'west');
        break;
      default:
        break;
    }
  }
}
