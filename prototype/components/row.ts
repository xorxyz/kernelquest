import * as EventEmitter from "events";
import { Cell, CellExport } from "./cell";

export type RowExport = {
  y: number,
  cells: Array<CellExport>
}

export class Row extends EventEmitter {
  y
  cells: Array<Cell>
  el

  constructor (w, y) {
    super();
    this.y = y;
    this.cells = Array(w).fill(0).map((_, x) => new Cell(x, y));
    this.el = document.createElement('div');
    this.el.className = 'flex'
    this.cells.forEach(cell => {
      this.el.appendChild(cell.el);
      cell.on('cell:click', e => {
        this.emit('cell:click', e);
      });
      cell.on('cell:right-click', e => {
        this.emit('cell:right-click', e);
      });
    })
  }

  static fromJSON (obj: RowExport) {
    const row = new Row(obj.cells.length, obj.y);

    row.cells = row.cells.map((_, i) => {
      return Cell.fromJSON(obj.cells[i]);
    });

    row.el.innerHTML = '';
    row.cells.forEach((cell) => {
      row.el.appendChild(cell.el);
    });

    return row;
  }

  toJSON (): RowExport {
    return {
      y: this.y,
      cells: this.cells.map(cell => cell.toJSON())
    };
  }
}