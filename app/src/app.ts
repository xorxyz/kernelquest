import { FileManager } from "./components/file-manager";
import { Grid } from "./components/grid";
import { Palette } from "./components/palette";
import { debug } from "./utils";
import { Tabs } from "./components/tabs";
import { EditorTerminal } from './components/editor-terminal';
import { AudioPlayer } from "./components/audio-player";
import game from "./game";
import { Cell } from "./components/cell";

const { version } = require('../package.json')

window.document.addEventListener('DOMContentLoaded', e => {
  const gridEl = document.getElementById('grid') as HTMLDivElement;
  const paletteEl = document.getElementById('palette') as HTMLDivElement;
  const fileMenuEl = document.getElementById('file_menu') as HTMLSelectElement;
  const fileInputEl = document.getElementById('file_input') as HTMLInputElement;
  
  const tabButtons = document.getElementById('tab_buttons') as HTMLDivElement;
  const editorTabButton = document.getElementById('editor_tab_button') as HTMLButtonElement;
  const gameTabButton = document.getElementById('game_tab_button') as HTMLButtonElement;
  const tabsEl = document.getElementById('tabs') as HTMLDivElement;

  const messagesEl = document.getElementById('messages') as HTMLInputElement;
  const textInputEl = document.getElementById('text_input') as HTMLInputElement;

  const mutedButtonEl = document.getElementById('mute_button') as HTMLButtonElement;
  const audioEl = document.getElementById('audio_player') as HTMLAudioElement;

  const versionEl = document.getElementById('version') as HTMLSpanElement;

  const tabs = new Tabs(tabsEl, tabButtons)
  const grid = new Grid(gridEl, game.engine);
  const palette = new Palette(paletteEl);

  grid.on('cell:click', e => {
    debug('clicked a cell', e);
    (e.cell as Cell).render(grid.room);
    // const glyph = e.cell.glyph === palette.selected ? '..' : palette.selected;
    // e.cell.setGlyph(glyph);
  });

  grid.on('cell:right-click', e => {
    debug('right clicked a cell', e);
    palette.selected = e.cell.glyph || '..';
    palette.update();
  });


  new EditorTerminal(textInputEl, messagesEl);
  new AudioPlayer(mutedButtonEl, audioEl);
  new FileManager(fileMenuEl, fileInputEl, grid);

  editorTabButton.addEventListener('click', () => tabs.select('edit'));
  gameTabButton.addEventListener('click', () => tabs.select('play'));

  palette.update();

  versionEl.innerText = ('XOR v' + String(version));

  textInputEl.focus();
});
