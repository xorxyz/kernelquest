import {
  IAction, IActionResult, IGameEvent, IHistoryEvent, ISaveFileContents,
} from '../shared/interfaces';
import { SaveGameId } from '../system/system_manager';

export interface IState {
  tick: number
  name: string
  stats: {
    level: number
    gold: number
  },
  history: IHistoryEvent[],
}

export interface ISystemState {
  saveGameId: SaveGameId
  game: IState
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
  readonly state: ISystemState = {
    saveGameId: 0,
    game: { ...EmptyGameState },
  };

  update(tick: number, playerAction: IAction | null, gameActions: IAction[]): IGameEvent[] {
    this.state.game.tick = tick;

    return [];
  }

  import(contents: ISaveFileContents): void {
    this.state.game.history = contents.history;
  }

  export(): ISaveFileContents {
    return { ...this.state.game };
  }
}
