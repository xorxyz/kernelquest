export interface State {}
export interface StateTransition {}

export abstract class FSM {
  current: State
  states: Map<StateTransition, State>
}
