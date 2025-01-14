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
import { Vector } from '../shared/vector';
import { Flag, Man, Scroll, Wall } from '../world/agent';

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

type SetupFn = (this: StateManager) => void

export class Level {
  fn: SetupFn

  constructor (fn: SetupFn) {
    this.fn = fn;
  }
}

export class StateManager {
  readonly entityManager = new EntityManager();

  private actionBuffer = new Queue<EveryAction>();

  readonly gameState: IGameState = { ...EmptyGameState }

  readonly shell: Runtime

  private tracing = false;
  
  private levels: Level[]

  private currentLevel = 0;

  constructor (shell: Runtime, levels: Level[]) {
    this.shell = shell;
    this.levels = levels;

    this.load(this.currentLevel);
  }

  update(tick: number, playerAction: EveryAction | null): IGameEvent[] {
    this.gameState.tick = tick;

    let action = playerAction;

    if (playerAction?.name === 'sh') {
      const printedExpression = playerAction.args.text;
      this.shell.print(`# ${printedExpression}`);
    }

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
            // const printedExpression = '';
            // const printedStack = this.shell.printStack();
            // const maxWidth = 90 - 14;
            // const ellipsis = printedStack.length > maxWidth ? '...' : ''
            // this.shell.print(`-> [${ellipsis}${this.shell.printStack().slice(-maxWidth)}]`);
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

    this.gameState.level.id = this.currentLevel;

    const ctx = {
      agent: this.entityManager.hero,
      area: this.entityManager.home,
      state: this.gameState,  
      shell: this.shell,
      entities: this.entityManager,
      load: this.load.bind(this)
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
  
  load(id: number) {
    this.entityManager.reset();
    this.entityManager.init();
    const level = this.levels[id];
    if (!level) throw new Error(`Level '${id}' does not exist.`);
    level.fn.call(this);
    this.currentLevel = id
  }

  import(contents: IGameState): void {
    this.gameState.history = { ...contents.history };
  }

  export(): ISaveFileContents {
    return { ...this.gameState };
  }
}
