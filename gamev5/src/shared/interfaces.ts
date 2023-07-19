/* Interfaces between modules and with the outside world. */

export type SerializableType = boolean | number | string

export type ActionArguments = Record<string, SerializableType>

// Allows undo/redo by storing some data with the action history
export type HistoryEventState = Record<string, SerializableType | Record<string, SerializableType>>

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
  state?: HistoryEventState
}

export interface IHistoryEvent {
  tick: number,
  agentId: number,
  action: IAction,
  failed?: boolean,
  state?: HistoryEventState,
}

export interface ISaveFileContents {
  name: string,
  stats: {
    level: number,
    gold: number,
    time: number
  },
  history: IHistoryEvent[]
}

export interface IKeyboardEvent {
  altKey: boolean,
  ctrlKey: boolean,
  shiftKey: boolean,
  key: string
}

export type KeyboardEventHandler = (evt: IKeyboardEvent) => void

export type AnsiString = string;

export interface ITerminal {
  write: (ansi: AnsiString) => void
  onKey: (cb: KeyboardEventHandler) => void
}
