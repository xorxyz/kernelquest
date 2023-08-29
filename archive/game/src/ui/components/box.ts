import { UiComponent } from '../component';

/** @category Components */
export class Box extends UiComponent {
  width: number;
  private lines: Array<string> = [];

  constructor(w, x, y, lines: Array<string>) {
    super(x, y);

    this.width = w;
    this.lines = lines.map((l) => l.slice(0, this.width));
  }

  render() {
    return [
      `${'┌'.padEnd(this.width, '─')}┐`,
      ...this.lines.map((line) => `│ ${line} │`),
      `${'└'.padEnd(this.width, '─')}┘`,
    ];
  }

  handleInput() { throw new Error('Not implemented.'); }
}
