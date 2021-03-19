/*
  # story/plot mechanics

  story -> branches -> prose -> choices

  > Systematizing the flow of causality in a simple and meaningful way

  - built around recording player knowledge
  - flat state machines to track plots
  - states imply their previous state
  - checks: if state_reached(), if state_between(a,b)
  - move_to_state()
  - track causality, the "state of the story": player knowledge or plot events
  - actors have a bag of content with preconditions
  - "encounter"
  - "narration"
  - decisions have consequences
  - feedback should be unambiguous
 */

import Graph, { INode } from '../../lib/graph';

export abstract class FlatStateMachine {
  graph: Graph
  node: INode

  abstract next(): void
  abstract check(condition): void
  abstract move(state): void
  abstract isStateReached(state): void
  abstract isStateBetween(stateA, stateB): void
}

export class Plot {
  name: string
  machine: FlatStateMachine
}

export type ActorPlots = Set<Plot>
