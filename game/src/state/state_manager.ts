import {
  ActionResultType, IActionResult, IGameEvent, ISaveFileContents,
} from '../shared/interfaces';
import { EntityManager } from './entity_manager';
import { IEngineState, IGameState } from './valid_state';
import { IActionContext } from '../world/action';
import {
  ActionMap, EveryAction, EveryActionName, actionWords, actions, isValidAction,
} from '../world/actions';
import { Runtime } from '../scripting/runtime';
import { Queue } from '../shared/queue';
import { defaultWords } from '../scripting/words';

export const EmptyGameState: IGameState = {
  tick: 0,
  name: '',
  stats: {
    level: 1,
    gold: 0,
  },
  history: [],
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
  private entityManager = new EntityManager();

  private actionBuffer = new Queue<EveryAction>();

  readonly engineState: IEngineState

  constructor() {
    this.engineState = {
      game: { ...EmptyGameState },
      shell: new Runtime([defaultWords, actionWords]),
      terminal: {
        output: []
      },
      debugMode: true
    };
  }

  update(tick: number, playerAction: EveryAction | null): IGameEvent[] {
    this.engineState.game.tick = tick;

    let action = playerAction;

    if (!this.engineState.shell.done()) {
      if (playerAction) {
        this.actionBuffer.add(playerAction);
      }

      if (!this.engineState.debugMode || playerAction?.name === 'next') {
        try {
          const next = this.engineState.shell.continue();
  
          if (next && isValidAction(next)) {
            action = next;
          }

          if (this.engineState.shell.done()) {
            this.engineState.terminal.output.push('ok');
          } else {
            this.engineState.terminal.output.push(
              `${this.engineState.shell.printStack()} <- ${this.engineState.shell.printExpression()}`
            )
          }

        } catch (err) {
          const errorMessage = (err as Error).message;
          this.engineState.terminal.output.push(errorMessage);
        }
      }

    } else if (this.actionBuffer.size) {
      action = this.actionBuffer.next();
      if (playerAction) {
        this.actionBuffer.add(playerAction);
      }
    }

    if (!action) return [];

    const ctx = {
      agent: this.entityManager.player,
      area: this.entityManager.home,
      state: this.engineState.game,
      shell: this.engineState.shell,
    };

    const events: IGameEvent[] = [];
    const result = performAction(ctx, action);

    if (result.type === ActionResultType.SUCCESS) {
      if (result.message) {
        this.engineState.terminal.output.push(result.message);
      }

      events.push({
        tick,
        agentId: 1,
        action,
        state: result.state,
      });
    }

    if (result.type === ActionResultType.FAILURE) {
      events.push({
        tick,
        agentId: 1,
        action,
        failed: true,
      });
    }

    return events;
  }

  import(contents: IGameState): void {
    this.engineState.game.history = { ...contents.history };
  }

  export(): ISaveFileContents {
    return { ...this.engineState.game };
  }
}
