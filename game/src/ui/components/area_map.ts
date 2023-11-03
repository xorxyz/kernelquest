import { Component } from '../component';
import { IGameState } from '../../state/valid_state';
import { Runtime } from '../../scripting/runtime';
import { Area } from '../../world/area';


export class AreaMapComponent extends Component {
  area: Area

  update(shell: Runtime, state: IGameState, area: Area): void {
    this.area = area;
  }

  render(): string[] {
    return this.area?.render() ?? [];
  }
}
