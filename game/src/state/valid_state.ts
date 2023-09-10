import { EveryActionName } from '../world/actions';
import { ActionArguments, GameEventState, IGameEvent } from '../shared/interfaces';
import { Runtime } from '../scripting/runtime';

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
  history: IValidGameEvent[]
}

export interface IEngineState {
  game: IGameState
  debugMode: boolean
  shell: Runtime
  terminal: {
    output: string[]
  }
}
