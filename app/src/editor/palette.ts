import { StandardGlyphs } from "../constants";

declare global {
  interface Window {
    twemoji: any
  }
}

export class Palette {
  el: HTMLDivElement
  selected: string = '##'

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

      return window.twemoji.parse(el);
    });

    this.el.replaceChildren(...elements);
  }
}
