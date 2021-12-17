import EventEmitter from "events"
import { Row, RowExport } from "./row"

export type GridExport = {
  rows: Array<RowExport>
}

export class Grid extends EventEmitter {
  w: number
  h: number
  el: HTMLElement
  rows: Array<Row>

  constructor (el: HTMLElement, w: number, h: number) {
    super();
    this.w = w;
    this.h = h;
    this.el = el;

    this.reset();
  }

  reset () {
    this.rows = Array(this.h).fill(0).map((_, y) => new Row(this.w, this.h));
    this.render();
  }

  render () {
    this.el.innerHTML = '';
    this.rows.forEach((row) => {
      this.el.appendChild(row.el);
      row.on('cell:click', (e) => this.emit('cell:click', e));
      row.on('cell:right-click', (e) => this.emit('cell:right-click', e));
    });
  }

  load (obj: GridExport) {
    this.rows = obj.rows.map(row => Row.fromJSON(row));
    this.render();

    window.twemoji.parse(this.el);
  }

  toJSON (): GridExport {
    return {
      rows: this.rows.map(row => {
        return row.toJSON();
      })
    }
  }
}