
export class Tabs {
  el: HTMLDivElement
  values: Array<string> = []

  constructor (el: HTMLDivElement) {
    this.el = el;
    Array.from(el.children).forEach(tab => {
      const value = tab.getAttribute('value');
      if (value) {
        this.values.push(value);
      } else {
        throw new Error('tabs: attribute value is missing for tab');
      }
    })
  }

  select (key: string) {
    Array.from(this.el.children).forEach(tab => {
      const value = tab.getAttribute('value');
      if (value === key) {
        tab.classList.remove('hidden');
      } else {
        tab.classList.add('hidden');
      }
    })
  }
}
