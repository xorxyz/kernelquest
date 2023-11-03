import {
  ActionResultType, IActionResult, IGameEvent, ISaveFileContents,
} from '../shared/interfaces';
import { EntityManager } from './entity_manager';
import { IGameState, IValidGameEvent } from './valid_state';
import { IActionContext } from '../world/action';
import {
  ActionMap, EveryAction, EveryActionName, actions, isValidAction,
} from '../world/actions';
import { Runtime } from '../scripting/runtime';
import { Queue } from '../shared/queue';

export const EmptyGameState: IGameState = {
  tick: 0,
  name: '',
  stats: {
    level: 1,
    gold: 0,
  },
  history: [],
  hero: {
    x: 0,
    y: 0,
  },
  level: {
    id: 1,
    victory: false
  }
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
  readonly entityManager = new EntityManager();

  private actionBuffer = new Queue<EveryAction>();

  readonly gameState: IGameState = { ...EmptyGameState }

  private shell: Runtime

  private tracing = false;

  constructor (shell: Runtime) {
    this.shell = shell;
    // shell.print('Good morning, Balthazar.');
    // shell.print(`Time for another puzzle. If you capture the flag, I might let you out.`);
    // shell.print(`You can say 'help' if you forget the magic words.`);

    shell.print(`You enter a vast, mostly empty room.`);
    shell.print(`In the back, a fire gently roars, casting shadows against the stone walls.`);
    shell.print(`The flag you seek rests in the center of the room, flat on the floor.`);
    shell.print(`You remember why you are here: you need to get the flag, and leave.`);
    shell.print(``);
    shell.print(`At any time, say 'help' to know what you can do.`);
  }

  update(tick: number, playerAction: EveryAction | null): IGameEvent[] {
    this.gameState.tick = tick;

    let action = playerAction;

    if (!this.shell.done()) {
      if (playerAction) {
        this.actionBuffer.add(playerAction);
      }

      if (!this.shell.isDebugEnabled() || playerAction?.name === 'next') {
        try {
          const next = this.shell.continue();
  
          if (next && isValidAction(next)) {
            action = next;
          }
          
          if (this.shell.done()) {
            this.shell.print(`# ${this.shell.printLastExpression()} -> [${this.shell.printStack()}]`);
          }

          if (this.tracing) {
            if (this.shell.done()) {
              // this.shell.print('ok');
            } else {
              this.shell.print(
                `${this.shell.printStack()} <- ${this.shell.printExpression()}`
              )
            }
          }
        } catch (err) {
          const errorMessage = (err as Error).message;
          this.shell.print(errorMessage);
        }
      }
    } else if (this.actionBuffer.size) {
      action = this.actionBuffer.next();
      if (playerAction) {
        this.actionBuffer.add(playerAction);
      }
    }

    if (!action) return [];

    this.gameState.level.id = this.entityManager.currentLevel;

    const ctx = {
      agent: this.entityManager.hero,
      area: this.entityManager.home,
      state: this.gameState,  
      shell: this.shell,
      entities: this.entityManager
    };

    const events: IGameEvent[] = [];
    const result = performAction(ctx, action);

    if (result.message) {
      this.shell.print(result.message);
    }

    if (result.type === ActionResultType.SUCCESS) {
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

    this.gameState.hero.x = this.entityManager.hero.position.x;
    this.gameState.hero.y = this.entityManager.hero.position.y;

    events.forEach(e => this.gameState.history.push(e as IValidGameEvent));

    if (events.length) console.log('events', events);

    return events;
  }

  import(contents: IGameState): void {
    this.gameState.history = { ...contents.history };
  }

  export(): ISaveFileContents {
    return { ...this.gameState };
  }
}
