---
title: Areas
---

Areas are immersive narrative players can explore.

- Genre (detective? exploration? heist? escape?)
- Setting (homelab? coffee shop? data center? office?)


### World

Integration in the persistent world

  - timeframe
  - physical location
  - historical moment
  - place


### Rooms & Doors

An area is made up of a graph of [rooms](rooms).
Rooms are the nodes and doors are the edges.


### Bots

[bots](bots) can be spawned in rooms when a given event is triggered. 
Bots listen to the room channel and react to certain queries.


### Triggers

A [triggers](triggers) is condition that activates an event.


### Events

Narrative device that happens in the game world in response to a 
trigger. An item spawns. A bot says something.


### Tasks

Things that can be accomplished in this area.

#### Searching

- ie: `find an item`

#### Puzzle

- ie: `figure this out `

#### Action

- ie: `go to x and do y with the z`


### Requirements

Players can only spawn an area in a lab if they
meet the area's requirements.  

- Knowledge
  - Ideas
  - Rumors
- Files
  - Binaries
  - Libraries
  - ASCII
  - UTF-8
  - Punycode
- Items
  - Devices
  - Parts
  - Consumables

### Devices

[Devices](devices) can be placed in rooms and networked with each other. Some devices can be picked up as items.


### Link

A link is how two devices are connected together.


### Services

[Services](services) run on devices and have a service-level agreement.


### Items

[Items](items) can be placed in rooms.
By default all items stay in the lab when players leave.
Specific items can be given as a prize when a team completes
an area.


### Music

Music from the [soundtrack](soundtrack) plays based on the 
current lab state.


---

### Notes for future 

components of escape rooms that could be modelled:

- service buttons
- game buttons
- sensors
- locks
- gadgets
- speakers
- prop
- furniture
- flag
- door
- camera
- microphone
- power bus
