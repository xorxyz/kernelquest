import { GameSystem } from '../core/classes';
import { ComponentMap } from '../core/types';
import Command from '../components/command'

const types = ['command'];

export default new GameSystem('command', types, updateFn);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateFn(components: ComponentMap) {
  components.get('command').forEach((command: Command) => {

  })
}
