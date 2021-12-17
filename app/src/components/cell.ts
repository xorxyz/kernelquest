import EventEmitter from "events"
import { Styles } from "../constants"

export type CellExport = {
  x: number
  y: number
  glyph: string
}

export class Cell extends EventEmitter {
  x: number
  y: number
  glyph: string
  readonly el: HTMLElement
  defaultClassList = 'w2 h2 ba flex items-center justify-center monospace'

  constructor (x, y) {
    super();

    this.x = x;
    this.y = y;
    this.el = document.createElement('div');
    this.setGlyph('..');

    this.el.addEventListener('contextmenu', e => {
      e.preventDefault();
      this.emit('cell:right-click', {
        cell: this
      })
    })

    this.el.addEventListener('click', e => {
      this.emit('cell:click', {
        cell: this
      })
    })
  }

  static fromJSON (obj: CellExport) {
    const cell = new Cell(obj.x, obj.y);
    
    cell.setGlyph(obj.glyph);

    return cell;
  }

  setGlyph (glyph: string) {
    this.glyph = glyph;
    this.el.innerText = glyph;
    this.el.className = this.defaultClassList;

    const style = Styles.find(([glyph]) => glyph === this.glyph);
    if (style) this.el.className += ' ' + style[1];

    window.twemoji.parse(this.el);
  }

  toJSON (): CellExport {
    return {
      x: this.x,
      y: this.y,
      glyph: this.glyph
    }
  }
}
