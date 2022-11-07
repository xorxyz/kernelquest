import { Cursor, esc, Keys, Style } from 'xor4-lib';
import { componentFrom, UiComponent } from '../component';
import { VirtualTerminal } from '../pty';
import { View } from '../view';
import { GameScreen } from './game-screen';
import { IntroScreen } from './intro-screen';
import { TitleScreen } from './title-screen';

class PlayerSelectMenu extends UiComponent {
  selected = 0;
  options = [
    { label: '1. 🧙 Kareniel      L01 GPx123 T01:23', key: '1' },
    { label: '2. 👼               L00 GPx000 T00:00', key: '2' },
    { label: '3. 👼               L00 GPx000 T00:00', key: '3' },
    { label: 'Copy                                  ', key: 'copy' },
    { label: 'Erase                                 ', key: 'erase' },
    { label: 'Exit                                  ', key: 'exit' },
  ];
  up() {
    if (this.selected === 0) {
      this.selected = this.options.length - 1;
      return;
    }
    this.selected--;
  }
  down() {
    if (this.selected === this.options.length - 1) {
      this.selected = 0;
      return;
    }
    this.selected++;
  }
  select() {
    const selected = this.options[this.selected];
    console.log('selected:', selected);
    return selected;
  }
  render() {
    const offset = this.selected * 2;

    return this.options
      .map((row, i) => {
        if (i === this.selected) return `${esc(Style.Invert)}${row.label}${esc(Style.Reset)}`;
        return `${row.label}`;
      })
      .flatMap((label) => [label, ''])
      .concat([esc(Cursor.setXY(this.position.x, this.position.y + offset))]);
  }
}

export class PlayerSelectScreen extends View {
  selected = 0;
  components = {
    title: componentFrom(39, 6, ['Player Select']),
    menu: new PlayerSelectMenu(27, 9),
  };

  handleInput(str: string, pty: VirtualTerminal) {
    if (str === Keys.ARROW_UP) this.components.menu.up();
    if (str === Keys.ARROW_DOWN) this.components.menu.down();
    if (str === Keys.ESCAPE) {
      pty.clear();
      pty.view = new IntroScreen(pty);
    }

    if (str === Keys.ENTER) {
      const selected = this.components.menu.select();

      if (['1', '2', '3'].includes(selected.key)) {
        pty.clear();
        pty.view = new GameScreen();
      }

      if (selected.key === 'exit') {
        pty.clear();
        pty.view = new IntroScreen(pty);
      }
    }
  }
}
