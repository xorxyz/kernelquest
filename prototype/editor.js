let grid;
let brush;

const EMOJIS = Array.from(
  [`🌬️✨👼🐑🚩🔒🗝️🦠💀🐲💍🛡️👑
  🌊👦🧚🏛️🏕️💰📕🐀👻🐍🕯️🏹🐌
  🌱👨🧝🌲🏘️🍓🗺️🐛🐺🕷️🥾⚔️🦌
  🔥👴🧙⛰️🏰🌿📜🦇👺👹🎒💣🦉`,
  ].join('')
);

const CHARS = [
  '##', '++', '--', 
  '~~', '..', ',,',
  '┌─', '┐.', '└─', '┘.', '├─', '┤.', '┬─', '┴─', '┼─', '──', '│.'
]

CHARS.forEach(char => EMOJIS.push(char));

class Brush {
  char = '🌲'
  constructor (el) {
    this.el = el;
  }
  update () {
    const els = EMOJIS.map(x => {
      const el = document.createElement('div');
      el.innerText = x
      el.addEventListener('click', e => {
        console.log(e.target.alt || e.target.innerText);
        this.char = e.target.alt || e.target.innerText;
        this.update();
      })
      if (x === this.char) {
        el.classList = 'bg-blue black'
      }

      twemoji.parse(el);
      return el;
    })

    this.el.replaceChildren(...els);
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

    const value = this.el.innerText || this.el.firstElementChild?.alt;

    console.log('value', value)

    if (value === brush.char) {
      this.el.classList += ' gray';
      this.el.textContent = '..'
    } else {
      this.el.textContent = brush.char;
      twemoji.parse(this.el);
      if (brush.char == '##') {
        this.el.classList += ' bg-moon-gray black b--white';
      }
      if (brush.char == '++' || brush.char == '--' || brush.char == '🔒') {
        this.el.classList += ' bg-white black';
      }
      if (brush.char == '~~') {
        this.el.classList += ' bg-blue white';
      }
      if (brush.char == ',,') {
        this.el.classList += ' b--white green';
      }
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
  const brushEl = document.getElementById('brush');
  grid = new Grid(16, 10);
  brush = new Brush(brushEl);

  brush.update();

  grid.rows.forEach((row) => {
    gridEl.appendChild(row.el);
  })
});
