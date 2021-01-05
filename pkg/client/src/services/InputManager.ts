export default class InputManager {
  constructor() {
    window.addEventListener('keyup', this.handleKey.bind(this));
  }

  onDestroy() {
    window.removeEventListener('keyup', this.handleKey.bind(this));
  }

  // eslint-disable-next-line class-methods-use-this
  handleKey(e) {
    e.preventDefault();

    switch (e.key) {
      case 'ArrowUp':

        break;
      case 'ArrowRight':
        // this.move(1, 0)
        break;
      case 'ArrowDown':
        // this.move(0, 1)
        break;
      case 'ArrowLeft':
        // this.move(-1, 0)
        break;
      default:
        break;
    }
  }
}
