import { IGameEvent, ISaveFileContents } from '../shared/interfaces';
import { EntityManager } from './entity_manager';
import { Area } from '../shared/area';
import { IGameState } from './valid_state';
import { IActionContext } from '../runtime/action';
import { logger } from '../shared/logger';
import { Agent } from '../runtime/agent';
import {
  ActionMap, EveryAction, EveryActionName, actions,
} from '../runtime/actions';

export const EmptyGameState = {
  tick: 0,
  name: '',
  stats: {
    level: 1,
    gold: 0,
  },
  history: [],
};

function isAction<K extends EveryActionName>(
  action: Record<string, unknown>, name: K,
): action is { name: K; args: ActionMap[K]['args']; } {
  return action['name'] === name;
}

function performAction<K extends EveryActionName>(
  ctx: IActionContext,
  action: { name: K, args: ActionMap[K]['args'] },
): void {
  const actionDefinition = actions[action.name];

  try {
    const validatedAction = actionDefinition.validator.parse(action) as { name: K, args: ActionMap[K]['args'] };
    if (isAction(validatedAction, action.name)) {
      actionDefinition.perform(ctx, validatedAction.args);
    } else {
      // oh no
    }
  } catch (err) {
    // oops
  }
}

export class StateManager {
  readonly game: IGameState = { ...EmptyGameState };

  private entityManager = new EntityManager();

  update(tick: number, playerAction: EveryAction | null): IGameEvent[] {
    this.game.tick = tick;
    if (!playerAction) return [];

    const ctx = { agent: new Agent(), area: new Area() };

    try {
      performAction(ctx, playerAction);

      return [];
    } catch (e) {
      logger.error('oops');

      return [];
    }
  }

  import(contents: IGameState): void {
    this.game.history = contents.history;
  }

  export(): ISaveFileContents {
    return { ...this.game };
  }
}
