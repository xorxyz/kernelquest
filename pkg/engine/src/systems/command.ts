import { GameSystem, SystemComponents } from '../../lib/ecs';
import Command from '../components/command'

const types = ['command'];

export default new GameSystem('command', types, updateFn);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateFn(components: SystemComponents) {
  components.get('command').forEach((command: Command) => {

  })
}
