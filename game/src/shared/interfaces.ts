/* Interfaces between modules and with the outside world. */

export type SerializableType = boolean | number | string | [number, number]

export type ActionArguments = Record<string, SerializableType>

// Allows undo/redo by storing some data with the action history
export type GameEventState = Record<string, SerializableType | Record<string, SerializableType>>

export interface IAction {
  name: string,
  args?: ActionArguments
}

export enum ActionResultType {
  SUCCESS = 0,
  FAILURE = 1
}

export interface IActionResult {
  type: ActionResultType
  message?: string
  state?: GameEventState
}

export interface IGameEvent {
  tick: number,
  agentId: number,
  action: IAction,
  failed?: boolean,
  state?: GameEventState,
}

export interface ISaveFileContents {
  tick: number,
  name: string,
  stats: {
    level: number,
    gold: number,
  },
  history: IGameEvent[]
}

export interface IKeyboardEvent {
  altKey: boolean,
  code: string,
  ctrlKey: boolean,
  shiftKey: boolean,
  key: string,
  keyCode: number,
}

export type KeyboardEventHandler = (evt: IKeyboardEvent) => void

export type AnsiString = string;

export interface ITerminal {
  write: (ansi: AnsiString) => void
  onKey: (cb: KeyboardEventHandler) => void
}
