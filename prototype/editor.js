let grid;
let palette;

const StandardGlyphs = Array.from(
  `🌬️✨👼🐑🚩🔒🗝️🦠💀🐲💍🛡️👑
  🌊👦🧚🏛️🏕️💰📕🐀👻🐍🕯️🏹🐌 
  🌱👨🧝🌲🏘️🍓🗺️🐛🐺🕷️🥾⚔️🦌
  🔥👴🧙⛰️🏰🍵📜🦇👺👹🎒💣🦉`
).concat([
  '##', '++', '--', 
  '~~', '..', ',,',
  '──', '│.', 
  '┌─', '┐.', '└─', '┘.',
  '├─', '┤.', '┬─', '┴─', '┼─', 
]);

console.log(StandardGlyphs);

const Styles = `
.. gray
## bg-moon-gray black b--white
++ bg-white black
-- bg-white black
🔒 bg-white black
~~ bg-blue white
,, b--white green
🕷 bg-red
 `.trim()
  .split('\n')
  .map(str => str.replace(' ', '\t').split('\t'));

console.log(Styles);

class Palette {
  el
  selected = '#'

  constructor (el) {
    this.el = el;
  }

  update () {
    const elements = StandardGlyphs.map(glyph => {
      const el = document.createElement('div');
    
      if (glyph === this.selected) {
        el.classList = 'bg-blue black'
      }
    
      el.innerText = glyph;
      el.addEventListener('click', (e) => {
        this.selected = e.target.alt || e.target.innerText;
        this.update();
      })

      console.log('selected ' + this.selected);
      return twemoji.parse(el);
    });

    this.el.replaceChildren(...elements);
  }
}

class Cell {
  x
  y
  defaultClassList = 'w2 h2 ba flex items-center justify-center monospace'

  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.el = document.createElement('div');
    this.el.classList = this.defaultClassList;
    this.el.classList += ' gray';
    this.el.innerText = '..';
    this.el.addEventListener('click', this.onClick.bind(this));
  }

  onClick () {
    console.log('clicked a cell', this.x, this.y);
    this.el.classList = this.defaultClassList;

    const glyph = this.el.innerText || this.el.firstElementChild?.alt;

    if (glyph === palette.selected) {
      this.el.classList += ' ' + 'gray';
      this.el.textContent = '..'
    } else {
      const style = Styles.find(([glyph]) => glyph === palette.selected);
      const classList = style[1];
      if (style) this.el.classList += ' ' + classList;
      this.el.textContent = palette.selected;
      twemoji.parse(this.el);
    }
  }
}

class Row {
  cells
  el
  constructor (w, y) { 
    this.cells = Array(w).fill(0).map((_, x) => new Cell(x, y));
    this.el = document.createElement('div');
    this.el.classList = 'flex'
    this.cells.forEach(cell => {
      this.el.appendChild(cell.el);
    })
  }
}

class Grid {
  rows
  constructor (w, h) {
    this.rows = Array(h).fill(0).map((_, y) => new Row(w, y));
  }
}

document.addEventListener('DOMContentLoaded', e => {
  const gridEl = document.getElementById('grid');
  const paletteEl = document.getElementById('palette');

  grid = new Grid(16, 10);
  palette = new Palette(paletteEl);

  grid.rows.forEach((row) => {
    gridEl.appendChild(row.el);
  });

  palette.update();
});
