import { SingletonComponent } from '../../lib/ecs';

export default class BackstageComponent extends SingletonComponent {
  constructor () {
    super('backstage', {
      actors: Array,
      items: Array,
      cells: Array
    })
  }
}
