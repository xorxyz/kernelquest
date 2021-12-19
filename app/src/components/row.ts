import EventEmitter from "events";
import { Tree } from "../../../game/engine/things";
import { Room } from "../../../game/engine/world";
import { Cell, CellExport } from "./cell";

export type RowExport = {
  y: number,
  cells: Array<CellExport>
}

export class Row extends EventEmitter {
  width: number
  y: number
  cells: Array<Cell>
  el: HTMLElement
  room: Room

  constructor (width: number, y: number, room: Room) {
    super();

    this.width = width;
    this.y = y;
    this.el = document.createElement('div');
    this.el.className = 'flex';
    this.room = room;
    this.reset();
  }

  reset () {
    this.cells = Array(this.width).fill(0).map((_, x) => {
      const cell = new Cell(x, this.y);

      cell.on('cell:click', e => {
        this.emit('cell:click', e);

        const isInEditMode = true;
        if (isInEditMode) {
          const tree = new Tree();
          const gameCell = this.room.cellAt(cell.vector);
          gameCell.items.push(tree);
        }
      });

      cell.on('cell:right-click', e => {
        this.emit('cell:right-click', e);
      });

      return cell;
    });
    this.render();
  }

  render () {
    this.el.innerHTML = '';
    this.cells.forEach((cell) => {
      cell.render(this.room);
      this.el.appendChild(cell.el);
    });
  }

  static fromJSON (obj: RowExport, room: Room) {
    const row = new Row(obj.cells.length, obj.y, room);

    row.cells = row.cells.map((_, i) => {
      return Cell.fromJSON(obj.cells[i]);
    });

    row.render();

    return row;
  }

  toJSON (): RowExport {
    return {
      y: this.y,
      cells: this.cells.map(cell => cell.toJSON())
    };
  }
}
