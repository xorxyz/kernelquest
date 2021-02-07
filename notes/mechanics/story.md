# story/plot mechanics

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

# benefits

1. plots can start in different ways
  - anyone in the world can tell you the thing you are trying to tell them
  - "cheat" by using whatever npc to drive the plot forward
  - state trees can drive the plot
2. "simulationist" gameplay
3. strategic gameplay
4. emergent solutions

# costs

1. unpredictibility
  - but bottlenecks can help
2. redundancy
3. bugs

