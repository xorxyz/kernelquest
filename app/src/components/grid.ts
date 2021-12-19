import { Engine } from "../../../game/engine/engine"
import { Room } from "../../../game/engine/world"
import { Component } from "./component"
import { Row, RowExport } from "./row"

export type GridExport = {
  rows: Array<RowExport>
}

export class Grid extends Component {
  w: number
  h: number
  engine: Engine
  room: Room
  rows: Array<Row>

  constructor (el: HTMLElement, engine: Engine) {
    super(el)
    this.w = 16;
    this.h = 10;
    this.el = el;
    this.engine = engine;
    this.room = engine.world.rooms[0];

    this.reset();
  }

  reset () {
    this.rows = Array(this.h).fill(0).map((_, y) => {
      const row = new Row(this.w, y, this.room);
    
      row.on('cell:click', e => {
        this.emit('cell:click', {
          ...e,
          row: this
        });
      });
  
      row.on('cell:right-click', e => {
        this.emit('cell:right-click', {
          ...e,
          row: this
        });
      });
  
      this.el.appendChild(row.el);

      return row;
    });
    this.render();
  }

  render () {
    this.el.innerHTML = '';
    this.rows.forEach((row) => {
      row.render();
      this.el.appendChild(row.el);
    });
  }

  load (obj: GridExport) {
    this.rows = obj.rows.map(row => Row.fromJSON(row, this.room));
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
