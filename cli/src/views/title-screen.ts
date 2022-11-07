import { esc, Keys, Style } from 'xor4-lib';
import { componentFrom } from '../component';
import { View } from '../view';
import { PlayerSelectScreen } from './player-select-screen';

export class TitleScreen extends View {
  components = {
    title: componentFrom(36, 6, ['🏰 Kernel Quest']),
    copyright: componentFrom(31, 24, [`${esc(Style.Dim)}© 2019-2023 Jonathan Dupré `]),
    prompt: componentFrom(37, 18, ['Press any key ']),
  };
  handleInput(str, pty) {
    if (str === Keys.ESCAPE) {
      if (global.electron) global.electron.exit();
      return;
    }
    pty.clear();
    pty.view = new PlayerSelectScreen();
  }
}
