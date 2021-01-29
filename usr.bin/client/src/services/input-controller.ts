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
  handleKey(e: KeyboardEvent) {
    e.preventDefault();

    switch (e.key) {
      case 'ArrowUp':
        if (e.shiftKey) {
          this.emit('command', { line: 'move north' });
        }
        break;
      case 'ArrowRight':
        if (e.shiftKey) {
          this.emit('command', { line: 'move east' });
        }
        break;
      case 'ArrowDown':
        if (e.shiftKey) {
          this.emit('command', { line: 'move south' });
        }
        break;
      case 'ArrowLeft':
        if (e.shiftKey) {
          this.emit('command', { line: 'move west' });
        }
        break;
      default:
        break;
    }
  }
}
