import { Cursor, esc, Keys, Style } from 'xor4-lib';
import { UiComponent } from '../component';
import { VirtualTerminal } from '../pty';
import { IntroScreen } from '../views/intro-screen';

/** @category Components */
export class Navbar extends UiComponent {
  visible = false;
  selected = 0;
  options = [
    { label: 'Save Game      ', key: 'save' },
    { label: 'Restore Game   ', key: 'load' },
    { label: 'Quit           ', key: 'quit' },
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
    return ['File           '].concat(
      this.options.map((row, i) => {
        if (i === this.selected) return `${row.label}`;
        return `${esc(Style.Invert)}${row.label}${esc(Style.Reset)}`;
      }),
      [esc(Cursor.setXY(this.position.x, this.position.y + this.selected))],
    );
  }
  handleInput(str: string, pty: VirtualTerminal) {
    if (str === Keys.ARROW_UP) this.up();
    if (str === Keys.ARROW_DOWN) this.down();
    if (str === Keys.ENTER) {
      const selected = this.select();
      if (selected.key === 'save') {
        pty.agent.schedule({ name: 'save' });
        pty.menuIsOpen = false;
        this.visible = false;
        pty.clear();
      }
      if (selected.key === 'load') {
        pty.agent.schedule({ name: 'load' });
        pty.menuIsOpen = false;
        this.visible = false;
        pty.clear();
      }
      if (selected.key === 'quit') {
        pty.clear();
        pty.menuIsOpen = false;
        this.visible = false;
        pty.view = new IntroScreen(pty);
      }
    }
  }
}
