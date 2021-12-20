import { Engine } from '../../game/engine';
import { World } from '../../game/engine/world';
import { debug } from "./utils";
import { Grid } from "./grid";
import { Tabs } from "./layout/tabs";
import { AudioPlayer } from "./layout/audio-player";
import { Palette } from "./editor/palette";
import { EditorTerminal } from "./editor/game-terminal";
import { Cell } from "./grid/cell";
import { FileManager } from "./editor/file-manager";
import { Agent, Sheep } from '../../game/engine/agents';
import { Vector } from '../../lib/math';
import { Book, Flag, Tree } from '../../game/engine/things';
import { GameTerminal } from './terminal';

const { version } = require('../package.json')
const versionString = 'XOR alpha v' + String(version);

window.document.addEventListener('DOMContentLoaded', e => {
  const world = new World();
  const engine = new Engine({ world });

  const trees = [
    [5,0],
    [1,1],
    [3,1],
    [4,1],
    [0,2],
    [1,4],
  ];

  const room = world.rooms[0];
  
  trees.forEach(([x,y]) => {
    room.cellAt(Vector.from({ x, y }))
        .items.push(new Tree());
  });

  room.cellAt(Vector.from({ x: 4, y: 0 }))
    .items.push(new Book());

  room.cellAt(Vector.from({ x: 14, y: 8 }))
    .items.push(new Flag());
  
  engine.start();

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
  const terminalContainerEl = document.getElementById('terminal-container') as HTMLElement;

  const tabs = new Tabs(tabsEl, tabButtons)
  const grid = new Grid(gridEl, engine);
  const palette = new Palette(paletteEl);

  new EditorTerminal(textInputEl, messagesEl);
  new AudioPlayer(mutedButtonEl, audioEl);
  new FileManager(fileMenuEl, fileInputEl, grid);
  new GameTerminal(terminalContainerEl, engine);

  versionEl.innerText = (versionString);

  editorTabButton.addEventListener('click', () => tabs.select('edit'));
  gameTabButton.addEventListener('click', () => tabs.select('play'));

  palette.update();
  textInputEl.focus();

  engine.clock.on('tick', () => {
    grid.render();
  });

  grid.on('cell:click', e => {
    debug('clicked a cell', e);
    const sheep = new Agent(new Sheep());
    const gridCell = (e.cell as Cell);

    sheep.position.copy(gridCell.vector);
    grid.room.add(sheep);
  });

  grid.on('cell:right-click', e => {
    debug('right clicked a cell', e);
    palette.selected = e.cell.glyph || '..';
    palette.update();
  });
});
