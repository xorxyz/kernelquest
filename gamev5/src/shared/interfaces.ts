/* Interfaces between modules and with the outside world. */

export type SerializableType = boolean | number | string

export type ActionArguments = Record<string, SerializableType>

export interface IAction {
  name: string,
  args?: ActionArguments
}

export interface IKeyboardEvent {
  altKey: boolean,
  ctrlKey: boolean,
  shiftKey: boolean,
  key: string
}

export interface ITerminal {
  write: (str: string) => void
  onKey: (cb: ((evt: IKeyboardEvent) => void)) => void
}
