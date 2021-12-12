import { FileManager } from "./components/file-manager";
import { Grid } from "./components/grid";
import { Palette } from "./components/palette";
import { debug } from "./utils";

import { TerminalWidget } from './components/terminal';

class Tabs {
  el: HTMLDivElement
  values: Array<string> = []

  constructor (el: HTMLDivElement) {
    this.el = el;
    Array.from(el.children).forEach(tab => {
      const value = tab.getAttribute('value');
      if (value) {
        this.values.push(value);
      } else {
        throw new Error('tabs: attribute value is missing for tab');
      }
    })
  }

  select (key: string) {
    Array.from(this.el.children).forEach(tab => {
      const value = tab.getAttribute('value');
      if (value === key) {
        tab.classList.remove('hidden');
      } else {
        tab.classList.add('hidden');
      }
    })
  }
}

new TerminalWidget();

window.document.addEventListener('DOMContentLoaded', e => {
  const gridEl = document.getElementById('grid') as HTMLDivElement;
  const paletteEl = document.getElementById('palette') as HTMLDivElement;
  const fileMenuEl = document.getElementById('file_menu') as HTMLSelectElement;
  const fileInputEl = document.getElementById('file_input') as HTMLInputElement;
  
  const playButton = document.getElementById('play_button') as HTMLButtonElement;
  const editButton = document.getElementById('edit_button') as HTMLButtonElement;
  const tabsEl = document.getElementById('tabs') as HTMLDivElement;
  
  const tabs = new Tabs(tabsEl)

  playButton.addEventListener('click', e => tabs.select('play'))
  editButton.addEventListener('click', e => tabs.select('edit'))

  const grid = new Grid(gridEl, 16, 10);
  const palette = new Palette(paletteEl);

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
