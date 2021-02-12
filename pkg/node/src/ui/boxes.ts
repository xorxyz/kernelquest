/* ui boxes. numbering starts at 1. */
import { Vector } from '../../lib/math';
import * as term from './term';

export interface IGameState {
  logs: Array<string>,
  input: string
}

export type RenderFn = (state: IGameState) => Array<string>

export class UiBox {
  render: RenderFn

  private size: Vector
  private position: Vector

  constructor(w: number, h: number, x: number, y: number, renderFn: RenderFn) {
    this.size = new Vector(w, h);
    this.position = new Vector(x, y);
    this.render = renderFn;
  }

  print(state: IGameState) : string | Error {
    const offset = (
      term.cursor.down(1) +
      term.line.start +
      term.cursor.right(this.position.x - 1) +
      term.line.clearAfter
    );

    const lines = this.render(state).map((line) => line + offset);

    return (
      term.cursor.setXY(this.position.x, this.position.y) +
      lines.join('')
    );
  }
}
