interface Window {
  twemoji: any
}

let grid;
let palette;

const StandardGlyphs = [
  '🌬️','✨','👼','🐑','🚩','🔒','🔑','🦠','💀','🐲','💍','🛡️','👑',
  '🌊','👦','🧚','🏛️','🏕️','💰','📕','🐀','👻','🐍','🕯️','🏹','🐌', 
  '🌱','👨','🧝','🌲','🏘️','🍓','🗺️','🐛','🐺','🕷️','🥾','⚔️','🦌',
  '🔥','👴','🧙','⛰️','🏰','🍵','📜','🦇','👺','👹','🎒','💣','🦉',
  '##', '++', '--', 
  '~~', '..', ',,',
  '~^', '~>', '~v', '~<',
  '──', '│.', 
  '┌─', '┐.', '└─', '┘.',
  '├─', '┤.', '┬─', '┴─', '┼─'
];

const Styles = `
.. mid-gray
## bg-moon-gray black b--white
++ bg-white black
-- bg-white black
🔒 bg-white black
~~ bg-blue white
~^ bg-blue white
~> bg-blue white
~v bg-blue white
~< bg-blue white
,, b--white green
🕷️ bg-red
 `.trim()
  .split('\n')
  .map(str => str.replace(' ', '\t').split('\t'));

class Palette {
  el
  selected = '##'

  constructor (el) {
    this.el = el;
  }

  update () {
    const elements = StandardGlyphs.map(glyph => {
      const el = document.createElement('div');
    
      el.innerText = glyph;

      el.addEventListener('click', (e) => {
        const selected = 
          (e.target as HTMLImageElement).alt || 
          (e.target as HTMLElement).innerText;
        if (!StandardGlyphs.includes(selected)) return;
        this.selected = selected;
        this.update();
      })
    
      if (glyph === this.selected) {
        el.className = 'bg-blue black'
      }

      console.log('selected ' + this.selected);
      return window.twemoji.parse(el);
    });

    this.el.replaceChildren(...elements);
  }
}

class Cell {
  x: number
  y: number
  glyph: string
  el: HTMLElement
  defaultClassList = 'w2 h2 ba flex items-center justify-center monospace'

  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.el = document.createElement('div');
    this.el.addEventListener('click', this.onClick.bind(this));
    this.setGlyph('..')
  }

  static fromJSON (obj) {
    const cell = new Cell(obj.x, obj.y);
    
    cell.setGlyph(obj.glyph);

    return cell;
  }

  setGlyph (glyph: string) {
    this.glyph = glyph;
    this.el.innerText = glyph;
    this.el.className = this.defaultClassList;

    const style = Styles.find(([glyph]) => glyph === this.glyph);
    if (style) this.el.className = this.defaultClassList + ' ' + style[1];

    window.twemoji.parse(this.el);
  }

  toJSON () {
    return {
      x: this.x,
      y: this.y,
      glyph: this.glyph
    }
  }

  onClick () {
    console.log('clicked a cell', this.x, this.y, this.glyph);
    this.el.className = this.defaultClassList;

    const style = Styles.find(([glyph]) => glyph === palette.selected);
    if (style) this.el.className = this.defaultClassList + ' ' + style[1];

    if (this.glyph === palette.selected) {
      this.el.innerText = '..'
    } else {
      this.glyph = palette.selected;
      this.el.innerText = this.glyph;
      window.twemoji.parse(this.el);
    }
  }
}

class Row {
  y
  cells
  el

  constructor (w, y) {
    this.y = y;
    this.cells = Array(w).fill(0).map((_, x) => new Cell(x, y));
    this.el = document.createElement('div');
    this.el.className = 'flex'
    this.cells.forEach(cell => {
      this.el.appendChild(cell.el);
    })
  }

  static fromJSON (obj) {
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

  toJSON () {
    return {
      y: this.y,
      cells: this.cells.map(cell => cell.toJSON())
    }
  }
}

class Grid {
  el
  rows
  constructor (el, w, h) {
    this.el = el
    this.rows = Array(h).fill(0).map((_, y) => new Row(w, y));
  }

  load (obj) {
    this.rows = obj.rows.map(row => Row.fromJSON(row));
    console.log(this.rows)
    this.el.innerHTML = '';
    this.rows.forEach((row) => {
      this.el.appendChild(row.el);
    });
    window.twemoji.parse(this.el);
  }

  save () {
    return {
      rows: this.rows.map(row => {
        return row.toJSON();
      })
    }
  }
}

function loadMap (name) {
  const item = localStorage.getItem('xor-editor:maps:' + name);
  return item ? JSON.parse(item) : null
}

function saveMap (name, value) {
  localStorage.setItem('xor-editor:maps:' + name, JSON.stringify(value));
}

class List {
  el
  constructor (el, items) {
    this.el = el

    const listEl = document.createElement('ol');
    listEl.className = 'list pl0 ma3'

    items.forEach(item => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.innerText = item;
      li.appendChild(button);
      listEl.appendChild(li);
    })
    
    this.el.appendChild(listEl);
  }
}

window.document.addEventListener('DOMContentLoaded', e => {
  const gridEl = document.getElementById('grid');
  const paletteEl = document.getElementById('palette');
  const mapsEl = document.getElementById('maps');

  const saveEl = document.getElementById('save');
  const loadEl = document.getElementById('load');

  saveEl?.addEventListener('click', e => {
    const obj = grid.save();
    console.log(obj);
    saveMap('test', obj);   
  })

  loadEl?.addEventListener('click', e => {
    const obj = loadMap('test');
    grid.load(obj);
  })

  grid = new Grid(gridEl, 16, 10);
  palette = new Palette(paletteEl);
  // maps = new List(mapsEl, [
  //   'Untitled',
  //   'Untitled (1)', 
  //   'Untitled (2)'
  // ]);

  grid.rows.forEach((row) => {
    gridEl?.appendChild(row.el);
  });

  palette.update();
});
