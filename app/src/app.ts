import { FileManager } from "./components/file-manager";
import { Grid } from "./components/grid";
import { Palette } from "./components/palette";
import { debug } from "./utils";
import { Tabs } from "./components/tabs";
import { EditorTerminal } from './components/editor-terminal';
import { AudioPlayer } from "./components/audio-player";
import game from "./game";

game.engine.start();

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

  const tabs = new Tabs(tabsEl, tabButtons)
  const grid = new Grid(gridEl, 16, 10);
  const palette = new Palette(paletteEl);

  new EditorTerminal(textInputEl, messagesEl);
  new AudioPlayer(mutedButtonEl, audioEl);

  editorTabButton.addEventListener('click', () => tabs.select('edit'));
  gameTabButton.addEventListener('click', () => tabs.select('play'));

  new FileManager(fileMenuEl, fileInputEl, grid);

  grid.on('cell:click', e => {
    debug('clicked a cell', e);
    const glyph = e.cell.glyph === palette.selected ? '..' : palette.selected;
    e.cell.setGlyph(glyph);
  });

  grid.on('cell:right-click', e => {
    debug('right clicked a cell', e);
    palette.selected = e.cell.glyph || '..';
    palette.update();
  });

  grid.rows.forEach((row) => {
    gridEl?.appendChild(row.el);
  });

  palette.update();
});
