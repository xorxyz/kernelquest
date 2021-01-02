import { IComponent } from '../core/interfaces';
import { JSType } from '../core/types';

export default class Position implements IComponent {
  type = 'position'
  data = {
    x: JSType.Number,
    y: JSType.Number,
  }
}
