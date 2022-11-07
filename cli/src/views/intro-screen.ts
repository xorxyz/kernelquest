import { Cursor, esc, Keys } from 'xor4-lib';
import { componentFrom } from '../component';
import { View } from '../view';
import { TitleScreen } from './title-screen';

export class IntroScreen extends View {
  timeout;
  constructor(pty) {
    super();
    this.timeout = setTimeout(() => {
      this.handleInput('ok', pty);
    }, 3000);
  }
  components = {
    title: componentFrom(36, 12, [
      'Jonathan presents...',
      esc(Cursor.setXY(100, 100)),
    ]),
  };
  handleInput(str, pty) {
    clearTimeout(this.timeout);
    if (str === Keys.ESCAPE) {
      if (global.electron) global.electron.exit();
      return;
    }
    pty.clear();
    pty.view = new TitleScreen();
  }
}
