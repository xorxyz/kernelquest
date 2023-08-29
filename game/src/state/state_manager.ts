import {
  ActionResultType, IActionResult, IGameEvent, ISaveFileContents,
} from '../shared/interfaces';
import { EntityManager } from './entity_manager';
import { IGameState } from './valid_state';
import { IActionContext } from '../world/action';
import {
  ActionMap, EveryAction, EveryActionName, actions,
} from '../world/actions';
import { Kernel } from '../os/kernel/kernel';

export const EmptyGameState: IGameState = {
  tick: 0,
  name: '',
  stats: {
    level: 1,
    gold: 0,
  },
  history: [],
  terminalText: [],
};

function performAction<K extends EveryActionName>(
  ctx: IActionContext,
  action: { name: K, args: ActionMap[K]['args'] },
): IActionResult {
  const actionDefinition = actions[action.name];
  const validatedAction = actionDefinition.validator.parse(action) as { name: K, args: ActionMap[K]['args'] };
  const result = actionDefinition.perform(ctx, validatedAction.args);

  return result;
}

export class StateManager {
  readonly game: IGameState = { ...EmptyGameState };

  private entityManager = new EntityManager();

  private kernel = new Kernel();

  update(tick: number, playerAction: EveryAction | null): IGameEvent[] {
    this.game.tick = tick;
    if (!playerAction) return [];

    const ctx = {
      agent: this.entityManager.player,
      area: this.entityManager.home,
      shell: this.kernel.shell,
      state: this.game,
    };

    const events: IGameEvent[] = [];
    const result = performAction(ctx, playerAction);

    if (result.type === ActionResultType.SUCCESS) {
      events.push({
        tick,
        agentId: 1,
        action: playerAction,
        state: result.state,
      });
    }

    if (result.type === ActionResultType.FAILURE) {
      events.push({
        tick,
        agentId: 1,
        action: playerAction,
        failed: true,
      });
    }

    return events;
  }

  import(contents: IGameState): void {
    this.game.history = contents.history;
  }

  export(): ISaveFileContents {
    return { ...this.game };
  }
}
