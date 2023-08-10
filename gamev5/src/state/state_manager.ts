import { MS_PER_GAME_CYCLE, SCREEN_HEIGHT, SCREEN_WIDTH } from '../shared/constants';
import { IHistoryEvent, ISaveFileContents } from '../shared/interfaces';
import { Vector } from '../shared/vector';

export interface IGameState {
  tick: number
  name: string
  stats: {
    level: number
    gold: number
  },
  history: IHistoryEvent[],
  cursor: Vector
}

export const EmptyGameState = {
  tick: 0,
  name: '',
  stats: {
    level: 1,
    gold: 0,
  },
  history: [],
  cursor: new Vector(SCREEN_WIDTH, SCREEN_HEIGHT),
};

export class StateManager {
  readonly state: IGameState = ({ ...EmptyGameState });

  update(tick: number): void {
    this.state.tick = tick;
  }

  import(contents: ISaveFileContents): void {
    this.state.history = contents.history;
  }

  export(): ISaveFileContents {
    const ticksInMinutes = Number(((this.state.tick * MS_PER_GAME_CYCLE * 1000) / 60).toFixed(2));
    return {
      name: this.state.name,
      stats: {
        level: this.state.stats.level,
        gold: this.state.stats.gold,
        time: ticksInMinutes,
      },
      history: this.state.history,
    };
  }
}
