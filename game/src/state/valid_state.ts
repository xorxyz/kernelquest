import { EveryActionName } from '../world/actions';
import { ActionArguments, GameEventState, IGameEvent } from '../shared/interfaces';

export interface IValidAction {
  name: EveryActionName,
  args?: ActionArguments
}

export interface IValidGameEvent extends IGameEvent {
  tick: number,
  agentId: number,
  action: IValidAction,
  failed?: boolean,
  state?: GameEventState,
}

export interface IGameState {
  tick: number
  name: string
  stats: {
    level: number
    gold: number
  },
  history: IValidGameEvent[],
  hero: {
    x: number,
    y: number
  },
  level: {
    id: number,
    victory: boolean
  }
}
