import { GameSystem, SystemComponents } from '../../lib/ecs';
import HealthComponent from '../components/health';

export const types = [HealthComponent.type];

const healthSystem = new GameSystem('health', types, updateFn);

export default healthSystem

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateFn(components: SystemComponents) {
  // todo
}
