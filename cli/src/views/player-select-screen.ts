import { createEmptySaveFile, SaveFileContents, SaveGameDict } from 'xor4-game/src/io';
import { Cursor, esc, Keys, Style } from 'xor4-lib';
import { componentFrom, UiComponent } from '../component';
import { VirtualTerminal } from '../pty';
import { View } from '../view';
import { GameScreen } from './game-screen';
import { IntroScreen } from './intro-screen';
import { PlayerNamingScreen } from './player-naming-screen';

const LINE_LENGTH = 42;
const MS_PER_STEP = 60;
const MS_PER_TICK = MS_PER_STEP * 2;

class PlayerSelectMenu extends UiComponent {
  selected = 0;
  options;
  saveGames: SaveGameDict;
  mode: 'default' | 'copying' | 'erasing' = 'default';

  defaultOptions = [
    // { label: 'Copy'.padEnd(LINE_LENGTH, ' '), key: 'copy' },
    { label: 'Erase'.padEnd(LINE_LENGTH, ' '), key: 'erase' },
    { label: 'Exit'.padEnd(LINE_LENGTH, ' '), key: 'exit' },
  ];

  constructor(x, y, saveGames: SaveGameDict) {
    super(x, y);
    this.saveGames = saveGames;
    this.reset();
  }

  reset() {
    this.options = [
      { label: this.buildLabel(0, this.saveGames[0]), key: 0 },
      { label: this.buildLabel(1, this.saveGames[1]), key: 1 },
      { label: this.buildLabel(2, this.saveGames[2]), key: 2 },
    ];
    if (this.mode === 'default') {
      this.options = this.options
        .concat([
          { label: 'Erase'.padEnd(LINE_LENGTH, ' '), key: 'erase' },
          { label: 'Exit'.padEnd(LINE_LENGTH, ' '), key: 'exit' },
        ]);
    }
    if (this.mode === 'erasing') {
      this.options = this.options
        .concat([
          { label: 'Cancel'.padEnd(LINE_LENGTH, ' '), key: 'cancel' },
        ]);
    }
  }

  formatTime(time: number) {
    const ms = MS_PER_TICK * time;
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;

    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  buildLabel(id: number, saveFile: SaveFileContents) {
    return [
      `${id + 1} `,
      '👼 ' +
      `${saveFile.name.padEnd(10, ' ')}`,
      '          ',
      `L${String(saveFile.stats.level).padStart(2, '0')} `,
      `GPx${String(saveFile.stats.gold).padStart(3, '0')} `,
      `T${this.formatTime(saveFile.stats.time)}`,
    ].join('');
  }
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
  components;

  constructor(saveGames: SaveGameDict) {
    super();
    this.components = {
      title: componentFrom(39, 6, ['Player Select']),
      menu: new PlayerSelectMenu(25, 9, saveGames),
    };
  }

  handleInput(str: string, pty: VirtualTerminal) {
    if (str === Keys.ARROW_UP) this.components.menu.up();
    if (str === Keys.ARROW_DOWN) this.components.menu.down();
    if (str === Keys.ESCAPE) {
      if (this.components.menu.mode === 'erasing') {
        this.components.menu.mode = 'default';
        this.components.menu.selected = 3;
        this.components.menu.reset();
        pty.clear();
        return;
      }
      pty.clear();
      pty.view = new IntroScreen(pty);
    }

    if (str === Keys.ENTER) {
      const selected = this.components.menu.select();

      if (this.components.menu.mode === 'erasing') {
        pty.engine.pause();
        const contents = createEmptySaveFile();
        global.electron.save(selected.key, createEmptySaveFile());
        pty.engine.saveGames[selected.key] = contents;
        this.components.menu.mode = 'default';
        this.components.menu.reset();
        pty.clear();
        pty.engine.start();
        return;
      }

      if ([0, 1, 2].includes(selected.key)) {
        const saveFile = pty.engine.saveGames[selected.key];
        console.log(saveFile);
        if (saveFile.name) {
          pty.clear();
          pty.engine.selectSaveFile(selected.key);
          pty.engine.load();
          pty.view = new GameScreen();
        } else {
          pty.clear();
          pty.view = new PlayerNamingScreen(selected.key);
        }
      }

      if (selected.key === 'erase') {
        this.components.menu.mode = 'erasing';
        this.components.menu.reset();
        this.components.menu.selected = 0;
        pty.clear();
      }

      if (selected.key === 'cancel') {
        this.components.menu.mode = 'default';
        this.components.menu.selected = 3;
        this.components.menu.reset();
        pty.clear();
        return;
      }

      if (selected.key === 'exit') {
        pty.clear();
        pty.view = new IntroScreen(pty);
      }
    }
  }
}
