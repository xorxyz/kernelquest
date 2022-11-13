import { SaveGameId } from 'xor4-game/src/io';
import { Cursor, esc, Keys } from 'xor4-lib';
import { UiComponent } from '../component';
import { Editor } from '../editor';
import { VirtualTerminal } from '../pty';
import { View } from '../view';
import { PlayerSelectScreen } from './player-select-screen';

class MessageBoxComponent extends UiComponent {
  render() {
    return [
      '┌────────────────────────────────────┐',
      '│                                    │',
      '│        What is your name?          │',
      '│                                    │',
      '│                                    │',
      '│                                    │',
      '└────────────────────────────────────┘',
    ];
  }
}

class InputComponent extends UiComponent {
  value = '';
  editor = new Editor();
  render(): string[] {
    return [
      `$ ${this.editor.value.padEnd(10, '_')}`,
      esc(Cursor.setXY(
        this.position.x + this.editor.cursor.x + 2,
        this.position.y,
      )),
    ];
  }
}

export class PlayerNamingScreen extends View {
  id: SaveGameId;
  components = {
    messageBox: new MessageBoxComponent(28, 9),
    input: new InputComponent(39, 13),
  };
  constructor(id: SaveGameId) {
    super();
    this.id = id;
  }

  handleInput(str: string, pty: VirtualTerminal) {
    if (str === Keys.ENTER) {
      if (!this.components.input.editor.value) return;
      pty.engine.selectSaveFile(this.id);
      const saveFile = pty.engine.saveGames[this.id];
      saveFile.name = this.components.input.editor.value;
      pty.engine.save();
      pty.view = new PlayerSelectScreen(pty.engine.saveGames);
      pty.clear();
      return;
    }
    this.components.input.editor.insert(str);
  }
}
