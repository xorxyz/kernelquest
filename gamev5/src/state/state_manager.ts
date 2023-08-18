import { Agent } from '../runtime/agent';
import {
  ActionArguments,
  GameEventState,
  IAction, IActionResult, IGameEvent, ISaveFileContents,
} from '../shared/interfaces';
import { IValidGameEvent } from './actions/valid_actions';
import { EntityManager } from './entity_manager';

export interface IActionContext {
  agent: Agent
}

export interface IActionDefinition<
  A extends ActionArguments = ActionArguments,
  S extends GameEventState = GameEventState
> {
  perform(ctx: IActionContext, arg: A): IActionResult
  undo(ctx: IActionContext, arg: A, previousState: S): IActionResult
}

export interface IGameState {
  tick: number
  name: string
  stats: {
    level: number
    gold: number
  },
  history: IValidGameEvent[],
}

export const EmptyGameState = {
  tick: 0,
  name: '',
  stats: {
    level: 1,
    gold: 0,
  },
  history: [],
};

export class StateManager {
  readonly game: IGameState = { ...EmptyGameState };

  private entityManager = new EntityManager();

  update(tick: number, playerAction: IAction | null): IGameEvent[] {
    this.game.tick = tick;

    return [];
  }

  import(contents: IGameState): void {
    this.game.history = contents.history;
  }

  export(): ISaveFileContents {
    return { ...this.game };
  }
}
