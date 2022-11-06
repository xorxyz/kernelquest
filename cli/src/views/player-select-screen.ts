import { Cursor, esc, Keys, Style } from 'xor4-lib';
import { componentFrom, UiComponent } from '../component';
import { VirtualTerminal } from '../pty';
import { View } from '../view';
import { GameScreen } from './game-screen';

class PlayerSelectMenu extends UiComponent {
  selected = 0;
  options = [
    '1. 🧙 Kareniel      L01 GPx123 T01:23',
    '2. 👼               L00 GPx000 T00:00',
    '3. 👼               L00 GPx000 T00:00',
    'Copy                                  ',
    'Erase                                 ',
    'Exit                                  ',
  ];
  up() {
    if (this.selected === 0) return;
    this.selected--;
  }
  down() {
    if (this.selected === this.options.length - 1) return;
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
        if (i === this.selected) return `${esc(Style.Invert)}${row}${esc(Style.Reset)}`;
        return `${row}`;
      })
      .flatMap((row) => [row, ''])
      .concat([esc(Cursor.setXY(this.position.x, this.position.y + offset))]);
  }
}

export class PlayerSelectScreen extends View {
  selected = 0;
  components = {
    title: componentFrom(40, 6, ['Player Select']),
    menu: new PlayerSelectMenu(27, 9),
  };

  handleInput(str: string, pty: VirtualTerminal) {
    if (str === Keys.ARROW_UP) this.components.menu.up();
    if (str === Keys.ARROW_DOWN) this.components.menu.down();
    if (str === Keys.ENTER) {
      this.components.menu.select();
      pty.view = new GameScreen();
    }
  }
}
