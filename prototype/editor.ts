import { FileManager } from "./components/file-manager";
import { Grid } from "./components/grid";
import { Palette } from "./components/palette";
import { debug } from "./lib/utils";

window.document.addEventListener('DOMContentLoaded', e => {
  const gridEl = document.getElementById('grid') as HTMLDivElement;
  const paletteEl = document.getElementById('palette') as HTMLDivElement;
  const fileMenuEl = document.getElementById('file_menu') as HTMLSelectElement;
  const fileInputEl = document.getElementById('file_input') as HTMLInputElement;

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
