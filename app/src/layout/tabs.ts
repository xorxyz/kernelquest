
export class Tabs {
  el: HTMLDivElement
  buttons: HTMLDivElement
  values: Array<string> = []

  constructor (el: HTMLDivElement, buttons: HTMLDivElement) {
    this.el = el;
    this.buttons = buttons;
    Array.from(el.children).forEach(tab => {
      const value = tab.getAttribute('value');
      if (value) {
        this.values.push(value);
      } else {
        throw new Error('tabs: attribute value is missing for tab');
      }
    })  
    this.select('edit');
  }

  select (key: string) {
    Array.from(this.buttons.children).forEach(tab => {
      const value = tab.getAttribute('value');
      if (value === key) {
        tab.classList.add('is-selected');
      } else {
        tab.classList.remove('is-selected');
      }
    })

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
