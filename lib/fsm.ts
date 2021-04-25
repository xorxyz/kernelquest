export interface StateTransition {}
export interface State {}

export abstract class FSM {
  current: State
  states: Map<StateTransition, State>
}
