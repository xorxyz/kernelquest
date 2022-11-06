import { Cursor, esc, Keys, Style } from 'xor4-lib';
import { UiComponent } from '../component';
import { TitleScreen } from '../views/title-screen';

/** @category Components */
export class Navbar extends UiComponent {
  visible = false;
  selected = 0;
  options = [
    'Save Game     ',
    'Restore Game  ',
    'Quit          ',
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
    return selected;
  }
  render() {
    if (!this.visible) return [];
    return ['File'].concat(
      this.options.map((row, i) => {
        if (i === this.selected) return `${row}`;
        return `${esc(Style.Invert)}${row}${esc(Style.Reset)}`;
      }),
      [esc(Cursor.setXY(this.position.x, this.position.y + this.selected))],
    );
  }
  handleInput(str: string, pty) {
    if (str === Keys.ARROW_UP) this.up();
    if (str === Keys.ARROW_DOWN) this.down();
    if (str === Keys.ENTER) {
      const selected = this.select();
      if (selected === 'Quit          ') {
        pty.view = new TitleScreen();
      }
    }
  }
}
