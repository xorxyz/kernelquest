import { IComponent } from '../core/interfaces';

export default class Command implements IComponent {
  type = 'command'
  data = {}
}
